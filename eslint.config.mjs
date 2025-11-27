import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nextPlugin from "eslint-config-next";
import importPlugin from "eslint-plugin-import";
import nPlugin from "eslint-plugin-n";
import promisePlugin from "eslint-plugin-promise";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["dist", ".next", "node_modules", "prisma/generated"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
      n: nPlugin,
      promise: promisePlugin,
      "react-hooks": reactHooks,
      next: nextPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "import/no-unresolved": "error",
      "import/order": ["warn", { alphabetize: { order: "asc" } }],
      "promise/always-return": "warn",
      "promise/no-return-wrap": "error",
      "n/no-unsupported-features/es-syntax": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-debugger": "error",
    },
  },
];
