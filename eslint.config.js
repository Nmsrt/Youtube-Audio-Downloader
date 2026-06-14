const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');

const sharedRules = {
  'no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
  ],
};

module.exports = [
  { ignores: ['node_modules/**'] },
  js.configs.recommended,
  {
    // Backend: Node CommonJS modules.
    files: ['server.js', 'src/**/*.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: sharedRules,
  },
  {
    // Frontend: browser ES modules.
    files: ['public/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    rules: sharedRules,
  },
  prettier,
];
