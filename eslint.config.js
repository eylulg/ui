import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'storybook-static', 'coverage', 'node_modules', '!.storybook'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
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
    files: ['src/**/*.test.tsx', 'src/test/**'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
);
