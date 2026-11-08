import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import sonarjs from "eslint-plugin-sonarjs";

// 类型感知规则集：基于 tsconfig.json 的 projectService，
// 由 typescript@6（typescript-eslint 运行时）提供类型信息，与 typecheck 使用的 typescript-native 互不影响
const tsTypeChecked = tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.ts"],
}));

export default [
    // 全局忽略
    {
        ignores: ["yamls/**", "convert.js", "convert.min.js", "node_modules/**"],
    },

    // 主规则：应用于所有 JS 文件
    {
        files: ["**/*.{js,mjs}"],
        languageOptions: {
            ecmaVersion: 2026,
            sourceType: "module",
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

    // TypeScript 类型感知规则：应用于所有 TS 文件
    ...tsTypeChecked,
    {
        files: ["**/*.ts"],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tseslint,
            },
        },
        rules: {
            // 允许未使用变量以 _ 开头
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
            ],
            // 异步正确性
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-misused-promises": "error",
            // 类型收窄正确性
            "@typescript-eslint/no-unnecessary-condition": "warn",
            "@typescript-eslint/no-unnecessary-type-assertion": "warn",
            "@typescript-eslint/switch-exhaustiveness-check": "error",
            // 语法现代化
            "@typescript-eslint/prefer-nullish-coalescing": "warn",
            "@typescript-eslint/prefer-optional-chain": "warn",
            "@typescript-eslint/no-non-null-assertion": "warn",
        },
    },

    // SonarJS 代码异味：认知复杂度、重复分支等（TS 与 JS 均生效）
    {
        ...sonarjs.configs.recommended,
        files: ["**/*.{js,mjs,ts}"],
        rules: {
            ...sonarjs.configs.recommended.rules,
            // 本项目本身就是 DNS/IP 规则集生成器，硬编码公网 DNS 地址是核心数据而非隐患
            "sonarjs/no-hardcoded-ip": "off",
        },
    },

    // 测试文件：node:test 的 describe/test 本身返回 Promise，且断言数据允许宽松写法
    {
        files: ["tests/**/*.ts"],
        rules: {
            "@typescript-eslint/no-floating-promises": "off",
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/no-unnecessary-condition": "off",
            "@typescript-eslint/no-base-to-string": "off",
            "sonarjs/no-alphabetical-sort": "off",
        },
    },

    // 关闭所有与 Prettier 格式冲突的 ESLint 规则（必须放最后）
    prettierConfig,
];
