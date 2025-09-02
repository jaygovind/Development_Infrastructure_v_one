const path = require('path');

module.exports = {
  root: true,
  ignorePatterns: ['dist/**/*'],
  env: { node: true, es2022: true },
  parserOptions: {
    // tsconfigRootDir ko absolute banao
    tsconfigRootDir: __dirname,
    // eslint ke liye dedicated tsconfig use karna best hota hai
    project: [path.join(__dirname, 'tsconfig.eslint.json')],
  },
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
          '@typescript-eslint/no-explicit-any': 'warn'
      },
    },
  ],
};
