import { defineConfig } from "oxlint";

export default defineConfig({
  env: { builtin: true },
  options: { typeAware: true, typeCheck: true },
  categories: { correctness: "warn", nursery: "allow", style: "allow" },
  ignorePatterns: [".claude/**", "node_modules/**", "dist/**"],
  plugins: [
    "eslint",
    "import",
    "oxc",
    "unicorn",
    "typescript",
    "promise",
    "react",
    "react-perf",
  ],
  rules: {
    "typescript/no-floating-promises": "error",
    "typescript/no-misused-promises": "error",
  },
});
