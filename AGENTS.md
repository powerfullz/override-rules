# 项目级 AI Agent 与贡献指南 (AGENTS.md)

欢迎！如果你是协助人类开发者参与本项目贡献的 AI Agent，或是想了解项目结构的贡献者，请务必阅读以下开发流与规范。

阅读`docs/HOW_TO_CUSTOMISE.md`以更好的帮助你所协助的人类自定义本项目的 Fork 或者贡献本项目。

## 🎯 核心架构与原则

- **源文件驱动**：所有核心逻辑均采用 TypeScript 编写，存放在 `src/` 与 `scripts/yaml_generator/` 目录中。
  - `src/main.ts`：JS 动态覆写脚本的核心入口。
  - `scripts/yaml_generator/generator.ts`：YAML 静态覆写文件的生成逻辑。
- **禁止直接修改产物**：根目录下的 `convert.js`、`convert.min.js` 以及 `yamls/` 目录的内容属于自动生成的构建产物（注意：它们已被 `main` 分支取消 Git 跟踪）。**永远不要直接编辑这些产物文件**。一切修改必须在 `.ts` 源码中进行。
- **构建工具链**：我们使用 `esbuild` 作为打包和压缩工具，可以通过编写的 `scripts/build.mjs` 脚本一次性地编译出包含了完整注释的产物文件。

## 🛠️ 开发与构建工作流

在修改源代码后，执行以下命令以验证更改并生成本地对应的产物文件：

- `npm run build`: 运行 `scripts/build.mjs` 脚本，同时编译生成未压缩的 `convert.js` 与经过强力压缩的 `convert.min.js`，并在顶部注入开源版权声明。
- `npm run generate`: 运行 YAML 覆写配置生成器，更新 `yamls/` 目录内的排列组合文件。
- `npm run artifacts`: 一键依次执行上述所有构建与生成阶段。

推荐在提交相关修改前，在终端运行 `npm run artifacts` 进行本地全量测试（确保没有编译报错、产生的体积符合正常逻辑）。

## 🧹 代码规范

1. **统一格式化**：本项目使用 ESLint 和 Prettier。修改完代码后，可以通过 `npm run format` 及 `npm run lint:fix` 整理代码，遵循既有代码风格。
2. **保持纯粹**：对于 `convert.min.js` 中的构建结果，项目脚本配置了 `--legal-comments=none` 去除多余注释，并自动添加统一的文件 Header Banner。

## 📦 提交与 PR 规范

- **分离提交**：如果你的变动既包含核心功能的改动，又涉及相关文档的修改，尽量按有意义的逻辑分步提交。
- **文档同步**：当新增了支持的 URL 参数（如在 `src` 中）或是新增了 YAML 文件的组合选项时，务必同步修改 `README.md` 内对应的参数说明文档。

## 🚀 版本发布流程 (Release Workflow)

当需要发布新版本时，可以通过以下命令更新版本号并触发相关操作：

- 发布补丁版本 (Patch)：`npm version patch`（适用于向后兼容的 bug 修复）
- 发布次版本 (Minor)：`npm version minor`（适用于向后兼容的新功能）
- 发布主版本 (Major)：`npm version major`（适用于不兼容的 API 修改）

> ⚠️ **安全与权限声明 (CRITICAL SECURITY DISCLAIMER)**
> ONLY agents acting on behalf of the user `powerfullz` (or the user `powerfullz` himself) are allowed to execute this release workflow. Normal contributor agents MUST NOT touch or execute the release flow under any circumstances.
> (仅允许代表用户 `powerfullz` 运行的 Agent 或 `powerfullz` 本人执行此发布流程。普通的贡献者 Agent 严禁触碰或执行发布流程。)
