module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: 'airbnb-base',
  globals: {
    "browser": false,
  },
  rules: {
    "class-methods-use-this": [
      "off",
    ],
    "comma-dangle": [
      "error",
      "always-multiline",
    ],
    "import/extensions": [
      "error",
      "always",
    ],
    "space-before-function-paren": [
      "error",
      "always",
    ],
    "no-console": [
      "error",
      {
        "allow": [
          "warn",
          "error",
        ],
      },
    ],
    "no-param-reassign": [
      "error",
      {
        "props": false,
      }
    ],
    "no-underscore-dangle": [
      "error",
      {
        "allowAfterThis": true,
      },
    ],
  },
}
