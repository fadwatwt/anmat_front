import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  { ignores: ['.next/**', 'out/**', 'dist/**', 'coverage/**', 'playwright-report/**', 'test-results/**', 'e2e/reports/**'] },
  ...compat.extends("next/core-web-vitals"),
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/*.test.{js,jsx}', '**/__tests__/**/*.{js,jsx}', 'jest.setup.js'],
    languageOptions: { globals: globals.jest },
  },
];

export default eslintConfig;
