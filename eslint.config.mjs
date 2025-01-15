import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
const eslintConfig = [
  ...compat.config({
    extends: ["next"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  }),
];
// const lintConfig = [
//   ...compat.extends([
//     "next",
//     "eslint:recommended",
//     "next/typescript",
//     "plugin:@typescript-eslint/recommended",
//     "prettier",
//     "plugin:prettier/recommended",
//   ]),
//   {
//     rules: {
//       "@next/next/no-img-element": "off",
//     },
//   },
// ];
export default eslintConfig;
