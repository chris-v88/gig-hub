import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  {
    ignores: ['node_modules/**', 'generated/**', 'coverage/**'],
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
      },
    },
    rules: {
      // Import rules (useful for any project)
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [
            'builtin',   // Node.js built-ins
            'external',  // npm packages
            'parent',    // ../ imports
            'sibling',   // ./ imports
            'index',     // index.js
          ],
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      
      // General JavaScript best practices
      'eqeqeq': 'error',
      'no-unused-vars': 'warn',
      'no-console': 'off', // Allow console in Node.js
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'off', // Allow unused vars in tests
    },
  },
];