import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    tseslint.configs.recommended,
    {
        ignores: ["node_modules", "dist"],
        rules: {
            // Type safety
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": "warn",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

            // Style & consistency
            semi: ["error", "always"],
            "comma-dangle": ["error", "always-multiline"],
            "no-multiple-empty-lines": ["error", { max: 1 }],
            "object-curly-spacing": ["error", "always"],
            "arrow-spacing": ["error", { before: true, after: true }],
            "space-before-function-paren": ["error", "never"],

            // Clean code
            "no-console": "warn",
            "no-debugger": "error",
            eqeqeq: ["error", "always"],
            curly: "error",
            "no-var": "error",
            "prefer-const": "error",

            // TS-specific
            "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
            "@typescript-eslint/explicit-module-boundary-types": "warn",
        },
    },
    prettier,
]);
