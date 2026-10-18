const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const root = path.resolve(__dirname, '..');
const dictionaries = Object.fromEntries(['ar', 'en'].map(lang => [lang, JSON.parse(fs.readFileSync(path.join(root, 'public/locales', lang, 'translation.json'), 'utf8'))]));
const missing = { ar: {}, en: {} };
const hardcoded = [];
let files = 0;
function walk(node, file) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'CallExpression' && node.callee?.type === 'Identifier' && node.callee.name === 't' && node.arguments[0]?.type === 'StringLiteral') {
    const key = node.arguments[0].value;
    for (const lang of ['ar', 'en']) {
      if (!(key in dictionaries[lang]) && !key.split('.').reduce((value, part) => value?.[part], dictionaries[lang])) {
        (missing[lang][key] ||= []).push(`${file}:${node.loc.start.line}`);
      }
    }
  }
  if (node.type === 'JSXText' && /[a-zA-Z]{3,}/.test(node.value.trim())) {
    hardcoded.push({ text: node.value.trim(), file, line: node.loc.start.line });
  }
  for (const [key, value] of Object.entries(node)) {
    if (key === 'loc' || key === 'comments') continue;
    if (Array.isArray(value)) value.forEach(item => walk(item, file));
    else if (value && typeof value === 'object') walk(value, file);
  }
}
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== '__tests__') scan(full);
    else if (entry.isFile() && /\.(js|jsx)$/.test(entry.name)) {
      files++;
      walk(parser.parse(fs.readFileSync(full, 'utf8'), { sourceType: 'unambiguous', plugins: ['jsx'] }), path.relative(root, full).replaceAll('\\', '/'));
    }
  }
}
scan(path.join(root, 'src'));
const result = { files, missing, hardcoded };
const output = process.argv[2];
if (output) fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ files, missingArabic: Object.keys(missing.ar).length, missingEnglish: Object.keys(missing.en).length, hardcodedText: hardcoded.length }));
