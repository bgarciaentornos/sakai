import html from "eslint-plugin-html";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("eslint:recommended"), {
    plugins: {
        html,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            $: "readonly",
            sakai: "readonly",
            sakaiSessionId: "readonly",
            portal: "readonly",
            CKEDITOR: "readonly",
            moment: "readonly",
            confirmDatePlugin: "readonly",
            flatpickr: "readonly",
            jQuery: "readonly",
            MathJax: "readonly",
        },

        ecmaVersion: 2020,
        sourceType: "module",
    },

    rules: {
        "accessor-pairs": "error",
        "array-callback-return": "error",
        "arrow-spacing": "warn",
        "block-spacing": "warn",
        "comma-spacing": "warn",
        "dot-notation": "warn",

        indent: ["warn", 2, {
            SwitchCase: 1,
            MemberExpression: "off",
            ignoredNodes: ["TemplateLiteral > *"],
        }],

        "linebreak-style": ["warn", "unix"],
        "no-array-constructor": "error",
        "no-caller": "error",
        "no-cond-assign": "warn",
        "no-constructor-return": "error",
        "no-duplicate-imports": "error",
        "no-else-return": "error",

        "no-empty": ["error", {
            allowEmptyCatch: true,
        }],

        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-implied-eval": "error",
        "no-iterator": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-lonely-if": "error",
        "no-loop-func": "error",
        "no-loss-of-precision": "error",
        "no-multi-str": "error",
        "no-multiple-empty-lines": "warn",
        "no-new-func": "error",
        "no-new-object": "error",
        "no-new-wrappers": "error",
        "no-octal-escape": "error",
        "no-param-reassign": "error",
        "no-proto": "error",
        "no-redeclare": "error",
        "no-return-await": "error",
        "no-script-url": "error",
        "no-self-compare": "error",
        "no-sequences": "error",

        "no-shadow": ["error", {
            allow: ["html"],
        }],

        "no-tabs": "warn",
        "no-trailing-spaces": "warn",
        "no-undef": "error",
        "no-undef-init": "error",
        "no-unmodified-loop-condition": "error",

        "no-unneeded-ternary": ["error", {
            defaultAssignment: false,
        }],

        "no-unreachable-loop": "error",
        "no-unused-vars": ["error"],
        "no-use-before-define": ["error", "nofunc"],
        "no-useless-backreference": "error",
        "no-useless-call": "error",
        "no-useless-computed-key": "error",
        "no-useless-constructor": "error",
        "no-useless-escape": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-var": "error",
        "object-shorthand": "error",
        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "prefer-exponentiation-operator": "error",
        "prefer-numeric-literals": "error",
        "prefer-object-spread": "error",
        "prefer-regex-literals": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        "require-atomic-updates": "error",
        semi: ["warn", "always"],
        strict: "error",

        yoda: ["error", "never", {
            onlyEquality: true,
        }],
    },
}];