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
    "arrow-parens": [
      "error",
      "always",
    ],
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
    "no-underscore-dangle": [
      "error",
      {
        "allowAfterThis": true,
      },
    ],
  },
}
