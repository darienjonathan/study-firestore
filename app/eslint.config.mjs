import tseslint from 'typescript-eslint';
import eslintjs from '@eslint/js';
import globals from 'globals';

import eslintPluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  eslintjs.configs.recommended,
  ...tseslint.configs.recommended,

  // 基本設定
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, $: true, jQuery: true },
    },
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'prettier/prettier': ['error', { singleQuote: true }],
    },
  },

  // vueの設定
  ...eslintPluginVue.configs['flat/essential'],
  {
    files: ['src/**/*.vue'],
    ignores: ['dist'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },

  // prettier
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
];
