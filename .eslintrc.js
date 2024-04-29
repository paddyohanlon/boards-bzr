// module.exports = {
//   root: true,
//   env: {
//     node: true,
//   },
//   extends: [
//     "plugin:vue/vue3-essential",
//     "eslint:recommended",
//     "@vue/typescript/recommended",
//     "@vue/prettier",
//     "@vue/prettier/@typescript-eslint",
//   ],
//   parserOptions: {
//     ecmaVersion: 2020,
//   },
//   rules: {
//     "prettier/prettier": ["error", { usePrettierrc: true }],
//     "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
//     "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
//     "@typescript-eslint/no-explicit-any": "off",
//     "@typescript-eslint/no-var-requires": "off",
//     "@typescript-eslint/ban-ts-comment": "off",
//     "@typescript-eslint/ban-types": "off",
//   },
// };

/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}

