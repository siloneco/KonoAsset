import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import unusedImports from 'eslint-plugin-unused-imports'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.js', '**/*.tsx'],

    plugins: {
      'unused-imports': unusedImports,
      'react-hooks': reactHooks,
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
    },
  },
)
