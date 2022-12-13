module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['google'],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    'quote-props': 0,
    'object-curly-spacing': 0,
    'comma-dangle': 0,
    'max-len': 0,
    indent: ['error', 2],
  },
  parserOptions: {
    sourceType: 'module',
  },
};
