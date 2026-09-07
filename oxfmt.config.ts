import { defineConfig } from "oxfmt";

export default defineConfig({
  tabWidth: 2,
  printWidth: 80,
  singleQuote: false,
  trailingComma: "all",
  sortPackageJson: true,
  sortTailwindcss: {
    stylesheet: "./styles/globals.css",
    functions: ["clsx", "cn"],
    preserveDuplicates: false,
    preserveWhitespace: true,
  },
  sortImports: {
    newlinesBetween: true,
    groups: [
      "type-import",
      ["value-builtin", "value-external"],
      "type-internal",
      "value-internal",
      ["type-parent", "type-sibling", "type-index"],
      ["value-parent", "value-sibling", "value-index"],
      "unknown",
    ],
  },
  ignorePatterns: [],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      options: {
        printWidth: 90,
      },
    },
    {
      files: ["*.md", "*.html"],
      options: {
        tabWidth: 2,
      },
    },
  ],
});
