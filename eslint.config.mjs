import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import * as tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/node_modules/**",
      "**/prisma/generated/**",
    ],
  }, // WTF? must stay isolated; otherwise it won't ignore the matches (eslint v9)
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],
    plugins: {
      react: reactPlugin,
      "typescript-eslint": tseslint,
    },
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      reactHooksPlugin.configs.flat["recommended-latest"],
      nextPlugin.configs.recommended,
      nextPlugin.configs["core-web-vitals"],
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-debugger": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "import/no-named-as-default": "off",
      "import/no-unresolved": "warn",
      "import/order": [
        "warn",
        {
          alphabetize: { order: "asc", caseInsensitive: true },
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always-and-inside-groups",
        },
      ], // unsupported on eslint v10 for now waiting merge -> https://github.com/import-js/eslint-plugin-import/pull/3230
    },
    settings: {
      "import/resolver": { typescript: { project: "./tsconfig.json" } },
    },
  },
]);
