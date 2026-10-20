import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";
import prettier from "eslint-config-prettier";

export default defineConfig(
    {
        ignores: [
            "node_modules/",
            "test-results/",
            "playwright-report/",
            "blob-report/",
            "playwright/.cache/",
            "allure-results/",
            "allure-report/",
        ],
    },
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ["tests/**/*.ts"],
        extends: [playwright.configs["flat/recommended"]],
    },
    {
        files: ["eslint.config.mjs"],
        extends: [tseslint.configs.disableTypeChecked],
    },
    prettier,
);
