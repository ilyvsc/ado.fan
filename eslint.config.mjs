import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import nPlugin from "eslint-plugin-n";
import promisePlugin from "eslint-plugin-promise";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    ignores: ["dist/*", "**/node_modules/*", "**/.next/*"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      n: nPlugin,
      import: importPlugin,
      promise: promisePlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
      "no-console": "off",
      "no-debugger": "error",
      "import/no-unresolved": "error",
      "import/order": ["warn", { alphabetize: { order: "asc" } }],
      "n/no-unsupported-features/es-syntax": "off",
      "promise/always-return": "warn",
      "promise/no-return-wrap": "error",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

export default eslintConfig;
