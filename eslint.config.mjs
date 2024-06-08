import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    languageOptions: { globals: globals.browser,ecmaVersion: 2021, sourceType: 'module' },
  rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'semi': ['error', 'always']
    },
  ignorePatterns: [
      'node_modules/',
      '/home/marc/src/foundryvtt/*'  // Ensure this path is correctly referenced
    ],
   
  },
  pluginJs.configs.recommended,
];