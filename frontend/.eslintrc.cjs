module.exports = {
  root: true,
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', 'jsx-a11y', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    // Prettier
    'prettier/prettier': 'warn',

    // General JS
    'no-console': 'off',
    'no-unused-vars': ['warn'],
    'consistent-return': 'off',
    'no-underscore-dangle': 'off', // MongoDB uses _id
    'no-alert': 'off',
    'no-use-before-define': 'off',
    'no-nested-ternary': 'off',

    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/button-has-type': 'off',
    'react/jsx-no-useless-fragment': 'off',
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'warn',

    // Accessibility
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/label-has-associated-control': 'off',

    // Imports
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
  },
  settings: {
    react: { version: 'detect' },
  },
};
