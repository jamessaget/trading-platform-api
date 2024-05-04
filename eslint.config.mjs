import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import stylisticJs from '@stylistic/eslint-plugin-js'


export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
        "@typescript-eslint/no-var-requires": "off",
        "no-constant-binary-expression": "off",
        '@stylistic/js/indent': ['error', 2],
        '@stylistic/js/semi': ["error", "always"],
        'quotes': ['error', 'single'],
        '@stylistic/js/object-curly-spacing': ["error", "never"],
    }
  }
];