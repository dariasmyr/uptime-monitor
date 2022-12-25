module.exports = {
  env: {
    browser: false,
    node: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  root: true,
  ignorePatterns: [".eslintrc.js"],
  extends: [
    "eslint:recommended",
    "plugin:sonarjs/recommended",
    "@jetbrains",
    "@jetbrains/eslint-config/node",
    "plugin:security/recommended",
    "plugin:unicorn/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:promise/recommended",
  ],
  overrides: [
    {
      files: ["test/**"],
      plugins: ["jest"],
      extends: ["plugin:jest/recommended"],
    },
    {
      files: ["**/*.md"],
      extends: ["plugin:markdown/recommended"],
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: [
    "sonarjs",
    "unicorn",
    "comments",
    "jest",
    "promise",
    "markdown",
    "security",
    "no-secrets",
  ],
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "unicorn/prevent-abbreviations": [
      "error",
      {
        allowList: { Param: true, Req: true, Res: true },
      },
    ],
    "no-secrets/no-secrets": "error",
    "max-len": "off",
    "no-return-assign": "off",
    "no-magic-numbers": "warn",
    "valid-jsdoc": "off",
    "no-native-reassign": "off",
    "multiline-ternary": "error",
    "no-shadow": [
      "error",
      {
        builtinGlobals: false,
        hoist: "functions",
        allow: [],
        ignoreOnInitialization: false,
      },
    ],
    "no-multiple-empty-lines": "error",
    "prefer-template": "error",
    "prefer-spread": "error",
    "prefer-arrow-callback": "error",
    "no-var": "error",
    "arrow-spacing": "error",
    "unicorn/prefer-module": "off"
  },
  settings: {
    jest: {
      version: require("jest/package.json").version,
    },
  },
};
