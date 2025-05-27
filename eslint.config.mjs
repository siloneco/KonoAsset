import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import unusedImports from 'eslint-plugin-unused-imports'
import importX from 'eslint-plugin-import-x'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import {
  configs as reactHooksConfigs,
  rules as reactHooksRules,
} from 'eslint-plugin-react-hooks'

export default tseslint.config(
  eslint.configs.recommended,
  // eslint-disable-next-line import-x/no-named-as-default-member
  tseslint.configs.recommended,
  // eslint-disable-next-line import-x/no-named-as-default-member
  importX.flatConfigs.recommended,
  // eslint-disable-next-line import-x/no-named-as-default-member
  importX.flatConfigs.typescript,
  {
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver()],
    },

    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],

    plugins: {
      'unused-imports': unusedImports,
      'react-hooks': { configs: reactHooksConfigs, rules: reactHooksRules },
    },

    languageOptions: {
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
      },
    },

    rules: {
      semi: [
        'error',
        'never',
        {
          beforeStatementContinuationChars: 'never',
        },
      ],

      'semi-spacing': [
        'error',
        {
          after: true,
          before: false,
        },
      ],

      'semi-style': ['error', 'first'],
      'no-extra-semi': 'error',
      'no-unexpected-multiline': 'error',
      'no-unreachable': 'error',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              from: `./src/components/model/**/*`,
              target: `./src/components/!(model|page|context)/**/*`,
            },
            {
              target: ['./src/components/!(presentation|container)/**/*'],
              from: ['./src/components/presentation/**/*'],
              except: ['./src/components/presentation/*/*/index.ts'],
            },
          ],
        },
      ],
    },
  },
)
