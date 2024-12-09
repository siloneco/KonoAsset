import unusedImports from "eslint-plugin-unused-imports";
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

export default [
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.ts", "**/*.js", "**/*.tsx"],

    plugins: {
      "unused-imports": unusedImports,
    },

    rules: {
      semi: [
        "error",
        "never",
        {
          beforeStatementContinuationChars: "never",
        },
      ],

      "semi-spacing": [
        "error",
        {
          after: true,
          before: false,
        },
      ],

      "semi-style": ["error", "first"],
      "no-extra-semi": "error",
      "no-unexpected-multiline": "error",
      "no-unreachable": "error",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",

      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];
