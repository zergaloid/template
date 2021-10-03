module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  ignorePatterns: ['src/sw.js'],
  rules: {
    'no-console': 'off'
  },
};
