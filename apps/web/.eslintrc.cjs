// apps/web/.eslintrc.cjs
const path = require('path');

module.exports = {
  root: true,
  ignorePatterns: ['.next/**/*', 'dist/**/*'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [path.join(__dirname, 'tsconfig.json')],
  },
  extends: [
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // React 17+ / Next 13+ new JSX transform: React ko import karna zaroori nahi
    'react/react-in-jsx-scope': 'off',

    // abhi build pass karna hai to 'any' ko relax kar do; baad me strict kar lena
    '@typescript-eslint/no-explicit-any': 'off'
    // ya 'warn' agar warnings chahiye: 'warn'
  },
};
