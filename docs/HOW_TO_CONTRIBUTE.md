# 贡献指南 (HOW TO CONTRIBUTE)

欢迎来到 `powerfullz/override-rules`！非常感谢你愿意为本项目贡献代码或新增特性。

本指南旨在帮助人类开发者和 AI 助手（如需了解针对 AI 的特殊规范，也可参考 [`AGENTS.md`](../AGENTS.md)）快速熟悉本项目的开发工作流。

## 🎯 核心架构与原则

- **源文件驱动**：所有核心逻辑均采用 TypeScript 编写，存放在 `src/` 与 `scripts/yaml_generator/` 目录中。
  - `src/main.ts`：JS 动态覆写脚本的核心入口。
  - `scripts/yaml_generator/generator.ts`：YAML 静态覆写文件的生成逻辑。
- **禁止直接修改产物**：根目录下的 `convert.js`、`convert.min.js` 以及 `yamls/` 目录的内容属于自动生成的构建产物（注意：它们已被 `main` 分支取消 Git 跟踪，并由 GitHub Actions 在发布时自动处理）。**永远不要直接编辑这些产物文件**。一切修改必须在 `.ts` 源码中进行。
- **构建工具链**：我们使用 `esbuild` 作为打包和压缩工具，可以通过编写的 `scripts/build.mjs` 脚本一次性地编译出包含了完整注释的产物文件。

## 🛠️ 开发与构建工作流

在准备提交你的代码之前，请按照以下步骤进行本地验证：

1. 安装依赖（如果尚未安装）：
   ```bash
   npm install
   ```

2. 进行代码修改。主要修改 `src/` 目录下的 TypeScript 文件。

3. 格式化并检查代码：
   ```bash
   npm run format
   npm run lint:fix
   ```

4. 构建并生成测试产物：
   执行以下命令以验证更改并生成本地对应的产物文件：
   - `npm run build`: 运行 `build.ts` 脚本，同时编译生成未压缩的 `convert.js` 与经过强力压缩的 `convert.min.js`，并在顶部注入开源版权声明。
   - `npm run generate`: 运行 YAML 覆写配置生成器，更新 `yamls/` 目录内的排列组合文件。
   - `npm run artifacts`: 一键依次执行上述所有构建与生成阶段。

   > **建议**：推荐在提交相关修改前，在终端运行 `npm run artifacts` 进行本地全量测试（确保没有编译报错、产生的体积符合预期）。

## 📦 提交与 Pull Request (PR) 规范

1. **分离提交**：如果你的变动既包含核心功能的改动，又涉及相关文档的修改，尽量按有意义的逻辑分步提交（多个 Commit）。
2. **文档同步**：当新增了支持的 URL 参数（如在 `src/args.ts` 中）或是新增了 YAML 文件的组合选项时，务必同步修改 `README.md` 内对应的参数说明文档。
3. **不要提交构建产物**：在提交你的 PR 时，不要将 `convert.js`、`convert.min.js` 或 `yamls/` 目录下的文件包含在你的提交中，请确保只提交 `.ts` 源码和必要的文档。

## 🚀 发布流程与权限声明

> **⚠️ 注意**：普通贡献者无需处理版本发布。

发布新版本（例如 `npm version patch/minor/major`）和创建 GitHub Releases 仅允许由项目维护者（`powerfullz`）或代表其运行的授权 AI Agent 操作。请在 PR 合并后交由维护者处理版本更新。

---

如果你在开发中遇到任何问题，或对某项优化存在疑问，欢迎随时在 Issues 中发起讨论。感谢你的参与！