import js from '@eslint/js';
import { importX } from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'storybook-static', 'coverage', 'node_modules', '!.storybook'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { 'react-hooks': reactHooks, 'import-x': importX },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-duplicates': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/[\\u2013\\u2014]/]',
          message: 'Use a plain hyphen, comma or colon instead of a long dash.',
        },
        {
          selector: 'JSXText[value=/[\\u2013\\u2014]/]',
          message: 'Use a plain hyphen, comma or colon instead of a long dash.',
        },
      ],
    },
  },
  {
    files: ['src/**/__tests__/**', 'src/test-utils/**'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
);
