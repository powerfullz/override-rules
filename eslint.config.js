const js = require("@eslint/js");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
    // 全局忽略
    {
        ignores: ["yamls/**", "convert.min.js", "node_modules/**"],
    },

    // 主规则：应用于所有 JS 文件
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "commonjs",
            globals: {
                // Node.js 全局变量
                require: "readonly",
                module: "writable",
                exports: "writable",
                __dirname: "readonly",
                __filename: "readonly",
                process: "readonly",
                console: "readonly",
                Buffer: "readonly",
                // SubStore / Clash 脚本环境全局变量
                $arguments: "readonly",
                $network: "readonly",
                $persistentStore: "readonly",
                $notify: "readonly",
                $done: "readonly",
            },
        },
        rules: {
            ...js.configs.recommended.rules,

            // 允许未使用变量以 _ 开头
            "no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
            ],
            // 禁止 console（Node.js 工具脚本中可保留）
            "no-console": "off",
            // 统一使用 === 而非 ==
            eqeqeq: ["error", "always", { null: "ignore" }],
            // 禁止 var，使用 const/let
            "no-var": "error",
            // 优先使用 const
            "prefer-const": ["warn", { destructuring: "all" }],
        },
    },

    // 关闭所有与 Prettier 格式冲突的 ESLint 规则（必须放最后）
    prettierConfig,
];
