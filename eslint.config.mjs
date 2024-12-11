import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.js", "**/*.tsx"],

    plugins: {
      "unused-imports": unusedImports,
    },

    languageOptions: {
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: "module",
      },
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
  }
);
