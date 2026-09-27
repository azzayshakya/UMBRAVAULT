import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals' // ← use your installed package

export default [
  { ignores: ['dist', 'node_modules'] },

  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser, // ← all browser globals (window, fetch, localStorage...)
        ...globals.es2021, // ← Promise, Map, Set, etc.
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        alias: {
          map: [
            ['@', './src'], // ← only @ alias, matches your jsconfig.json
          ],
          extensions: ['.js', '.jsx'],
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/self-closing-comp': 'warn', // ← <Component /> not <Component></Component>
      'react/jsx-no-duplicate-props': 'error', // ← catches copy-paste prop bugs

      // Hooks (critical for zustand + react-hook-form)
      'react-hooks/exhaustive-deps': 'warn', // ← missing useEffect deps

      // Imports
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-duplicates': 'error', // ← no importing same module twice

      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-debugger': 'error', // ← never commit debugger
      eqeqeq: ['error', 'always'], // ← === not ==

      'react-refresh/only-export-components': 'warn',
    },
  },

  prettier, // must be last
]
