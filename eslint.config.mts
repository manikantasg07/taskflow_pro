import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier";  
import prettierPlugin from "eslint-plugin-prettier";  

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"], 
    plugins: { js,prettier:prettierPlugin }, 
    extends: ["js/recommended"],
    rules:{
      "prettier/prettier":"error",
      "no-unused-vars":"error",
      "no-console":"warn"
    }
  },
    // languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  {
    files: ["client/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ["server/**/*.{ts}"],
    languageOptions: { globals: globals.node }
  },
  prettierConfig
]);
