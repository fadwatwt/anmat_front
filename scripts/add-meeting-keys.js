const fs = require("path") && require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const arPath = path.join(root, "public/locale/ar/translation.json");
const enPath = path.join(root, "public/locale/en/translation.json");

const ar = JSON.parse(fs.readFileSync(arPath, "utf8"));
const en = JSON.parse(fs.readFileSync(enPath, "utf8"));

const additionsAr = {
  "Set Reminder": "ضبط تذكير",
  "Reminder Set": "تم ضبط التذكير",
  "No meeting link": "لا يوجد رابط للاجتماع",
  "Join the meeting": "انضم إلى الاجتماع",
  "Share": "مشاركة",
  'A reminder for "{{name}}" has been added to your agenda.':
    'تمت إضافة تذكير بـ "{{name}}" إلى أجندتك.',
  "Failed to set reminder": "فشل في ضبط التذكير",
  "In Person": "حضوري",
  "Online": "عبر الإنترنت",
  "Organizers": "المنظّمون",
  "Select Organizers": "اختر المنظّمين",
};

let arAdded = 0;
let enAdded = 0;
for (const [key, val] of Object.entries(additionsAr)) {
  if (!(key in ar)) {
    ar[key] = val;
    arAdded++;
  }
  if (!(key in en)) {
    en[key] = key;
    enAdded++;
  }
}

function serialize(obj, original) {
  const crlf = original.includes("\r\n");
  let out = JSON.stringify(obj, null, 2);
  if (crlf) out = out.replace(/\n/g, "\r\n");
  out += crlf ? "\r\n" : "\n";
  return out;
}

fs.writeFileSync(arPath, serialize(ar, fs.readFileSync(arPath, "utf8")), "utf8");
fs.writeFileSync(enPath, serialize(en, fs.readFileSync(enPath, "utf8")), "utf8");
console.log("AR added:", arAdded, "| EN added:", enAdded);
