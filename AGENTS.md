# AGENTS.md — AI Agent 与贡献者指南

本文件面向两类读者：

- 协助人类开发者修改本项目的 AI Agent；
- 第一次参与本项目的贡献者。

目标：让你快速知道**改哪里、怎么验证、什么绝对不能碰**。

> 深入阅读：
>
> - [`README.md`](README.md)：用户使用说明、URL 参数与产物获取方式
> - [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)：架构、数据流与设计决策
> - [`docs/HOW_TO_CUSTOMISE.md`](docs/HOW_TO_CUSTOMISE.md)：Fork 后的自定义指南
> - [`docs/HOW_TO_CONTRIBUTE.md`](docs/HOW_TO_CONTRIBUTE.md)：面向人类贡献者的流程说明

---

## 0. 速查

```bash
npm install

# 日常修改后
npm run format
npm run lint:fix
npm test

# 生成构建产物（build + generate，不包含测试和 lint）
npm run artifacts
```

提交前建议跑一遍：

```bash
npm run format:check && npm run lint && npm run typecheck && npm test && npm run artifacts
```

---

## 1. 这是什么

本项目为 **Mihomo/Clash 订阅覆写工具**：读取上游订阅的代理节点，按落地/非落地、国家/地区、低倍率、Tailscale 等维度分类，再生成代理组、分流规则、DNS、TUN 等配置。

项目同时产出两种形式：

| 形式 | 入口 | 特点 |
| --- | --- | --- |
| JS 动态覆写 | `src/main.ts` → `convert.js` / `convert.min.js` | 主推方式；运行时读取真实节点，支持 URL 参数 |
| 静态 YAML 覆写 | `scripts/yaml_generator/generator.ts` → `yamls/*.yaml` | 备用方式；用假节点穷举参数组合，适合不能执行 JS 的客户端 |

两种形式共享 `src/catalog/` 与 `src/builders/` 的逻辑，区别只在数据来源和过滤方式。详见 [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)。

---

## 2. 项目规则

| 规则 | 说明 |
| --- | --- |
| **只改源码** | 行为修改必须落在 `src/`、`scripts/yaml_generator/`、`tests/` 或文档中 |
| **不碰构建产物** | `convert.js`、`convert.min.js`、`yamls/` 均由脚本生成，且已被 `.gitignore` 忽略。**不要编辑，也不要提交** |
| **不碰发布分支** | `dist`、`preview` 由 GitHub Actions 生成，禁止向它们提交、合并或手动推送 |
| **不要合并两份 TypeScript** | `typescript-native`（TS 7）与 `typescript`（TS 6）并存是刻意设计，详见第 8 节 |
| **保持文档同步** | 新增或修改 URL 参数、代理组行为、构建命令时，同步更新对应文档，详见第 9 节 |
| **发布需授权** | 版本发布仅限 `powerfullz` 本人或其授权的 Agent，详见第 11 节 |

---

## 3. 架构与目录

核心数据流：

```text
$arguments
  → buildFeatureFlags()      // src/args
  → analyzeNodes()           // src/analysis
  → buildBaseLists()         // src/builders/selectors.ts
  → buildProxyGroups()       // src/builders/proxy-groups.ts
  → assembleConfig()         // src/builders/config.ts
```

文件分为「声明式数据 / 构建逻辑 / 最终组装」三层结构：

| 路径 | 职责 |
| --- | --- |
| `src/main.ts` | JS 覆写入口；读取 `$arguments`、编排流程、暴露 `globalThis.main` |
| `src/args/` | URL 参数解析；默认值的唯一来源是 `schema.ts` |
| `src/analysis/` | 节点分类：落地/非落地、国家/地区、低倍率、Tailscale |
| `src/builders/` | 纯构建函数：候选列表、代理组、规则、DNS、TUN、最终配置 |
| `src/catalog/` | 声明式数据：组名、图标、国家元数据、服务组、规则集、DNS 常量 |
| `src/domain/` | 代理组工厂；字段顺序与空候选兜底集中在此 |
| `src/types/` | 按域拆分的类型定义：`args` / `proxy` / `clash` |
| `src/utils/` | 无业务状态的通用工具函数 |
| `ruleset/` | 项目自维护的规则列表（如 TikTok、E-Hentai、SteamFix） |
| `scripts/build.mjs` | 用 esbuild 打包 `convert.js` 与压缩版 `convert.min.js` |
| `scripts/yaml_generator/generator.ts` | 用 `fake_proxies.json` 穷举生成 `yamls/`，固定启用 `regex=true` |
| `tests/` | 与 `src/` 目录对应的单元测试 |
| `docs/` | 架构、自定义与贡献文档 |

完整文件职责表见 [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md#文件职责)。

---

## 4. 环境与命令

首次拉取后执行 `npm install`（CI 使用 `npm ci`）。

| 命令 | 作用 | 备注 |
| --- | --- | --- |
| `npm run typecheck` | 全量类型检查 | 使用 `typescript-native`（TS 7），不产出文件；不要用 `npx tsc` 代替 |
| `npm test` | 运行全部单元测试 | Node 内置 test runner，通过 `tsx` 加载 TS |
| `node --import tsx --test tests/args/parse.test.ts` | 运行单个测试文件 | 路径替换为目标测试即可 |
| `npm run lint` | ESLint 检查 | `npm run lint:fix` 自动修复 |
| `npm run format` | Prettier 格式化 | `npm run format:check` 只检查不写入 |
| `npm run build` | 类型检查 + esbuild 打包 | 生成未压缩 `convert.js` 与压缩版 `convert.min.js` |
| `npm run generate` | 生成静态 YAML | **依赖 `convert.js`**；`LIMIT_COMBOS=10 npm run generate` 可限制数量 |
| `npm run artifacts` | `build` + `generate` | 本地全量产物生成，**不运行测试或 lint** |
| `npm version patch\|minor\|major` | 发布新版本 | 仅授权者可执行，详见第 11 节 |

> 注意：`npm run generate` 不会自动构建。若 `convert.js` 不存在或未更新，请先运行 `npm run build`（或直接运行 `npm run artifacts`）。

---

## 5. 标准开发流程

1. 从 `main` 创建独立分支，避免直接在主分支上开发。
2. 阅读第 7 节，确认需求对应的修改入口。
3. 修改 `.ts` 源码，必要时补充测试。
4. 格式化并修复 lint：

   ```bash
   npm run format
   npm run lint:fix
   ```

5. 运行测试：

   ```bash
   npm test
   ```

6. 生成并检查产物：

   ```bash
   npm run artifacts
   ```

   确认命令无报错，且 `yamls/` 能正常生成。产物仅用于本地验证，**不要提交**。

7. 按第 10 节整理提交并创建 PR。

---

## 6. 测试规范

- 测试位于 `tests/`，目录结构尽量与 `src/` 对应，文件名使用 `<模块>.test.ts`。
- 使用 Node 内置测试框架与严格断言：

  ```ts
  import assert from "node:assert/strict";
  import { describe, it } from "node:test";

  import { buildFeatureFlags } from "../../src/args/parse";
  ```

- `describe` / `it` 的描述沿用现有风格，使用简洁中文说明行为。
- 以下改动应补充或更新测试：
  - 参数解析与默认值（`tests/args/`）
  - 节点分类与地区阈值（`tests/analysis/`）
  - 代理组构造、字段顺序、空组兜底（`tests/builders/`、`tests/domain/`）
  - 规则、DNS、TUN、最终配置组装（`tests/builders/`）
- 测试不应依赖已生成的 `convert.js` 或 `yamls/`；直接 import 源码模块。

---

## 7. 常见改动入口

| 需求 | 修改位置 | 需要同步 |
| --- | --- | --- |
| 新增/修改 URL 参数 | `src/types/args.ts`、`src/args/schema.ts`、`src/args/parse.ts` | `README.md` 参数说明、`src/main.ts` 顶部 banner、`tests/args/parse.test.ts` |
| 修改参数默认值 | `grouptype` / `threshold` / `fakeip` 改 `src/args/schema.ts`；布尔开关默认值在 `src/args/parse.ts` 的 `buildFeatureFlags()` | 若默认行为变化，更新 `README.md` 与 `docs/ARCHITECTURE.md` |
| 新增代理组名称 | `src/catalog/group-names.ts` | 图标登记到 `src/catalog/icons.ts` |
| 新增服务代理组 | `src/catalog/service-groups.ts` | 声明式目录，通常无需改组装逻辑 |
| 调整国家/地区匹配或图标 | `src/catalog/countries.ts` | 必要时补测试；行为变化时更新文档 |
| 新增 Rule Provider | `src/catalog/rule-sets.ts`，再在 `src/builders/rules.ts` 中引用；自维护列表放入 `ruleset/` | 规则集键受 `RuleSetKey` 约束，改名会在编译期报错 |
| 调整规则顺序或分流目标 | `src/builders/rules.ts` | `tests/builders/rules.test.ts` |
| 调整代理组字段顺序或空组兜底 | `src/domain/proxy-group.ts` | `tests/domain/proxy-group.test.ts` |
| 调整 DNS / TUN / full 配置 | `src/builders/dns.ts`、`tun.ts`、`full-config.ts` | 对应测试与 `README.md` |
| 调整静态 YAML 生成 | `scripts/yaml_generator/generator.ts`、`fake_proxies.json` | `README.md` 中的文件命名与说明 |
| 更新架构或数据流 | `docs/ARCHITECTURE.md` | 必要时同步 `README.md` |

更多自定义示例见 [`docs/HOW_TO_CUSTOMISE.md`](docs/HOW_TO_CUSTOMISE.md)。

---

## 8. 代码风格与设计约束

### 格式与 lint

- Prettier：4 空格缩进、双引号、分号、行宽 100、LF 换行。
- ESLint：禁止 `var`，要求 `===`，优先 `const`；未使用变量可以 `_` 开头。
- 修改后运行 `npm run format` 与 `npm run lint:fix`，不要手工对抗格式化规则。
- 提交时 Husky 会执行 `npx lint-staged`，对暂存的文件运行 Prettier。

### TypeScript

- 开启 `strict`，不要用 `any` 绕过类型问题。
- 开启 `erasableSyntaxOnly`：不要使用 `enum`、`namespace`、构造函数参数属性等不可擦除语法。
- 开启 `verbatimModuleSyntax`：仅用于类型的导入请使用 `import type`。
- 沿用现有中文注释风格；注释解释「为什么」，而不是重复代码表面行为。

### 分类及管理

- `catalog/` 只放声明式数据，`builders/` 只放无状态构建逻辑，`main.ts` 只做流程编排。
- 代理组的字段顺序由 `src/domain/proxy-group.ts` 的工厂函数统一保证，不要在调用处随意调整。
- 空候选组补 `DIRECT` 的兜底逻辑集中在 `src/domain/proxy-group.ts`，不要重复实现。
- `"节点"` 后缀只在展示层（`buildBaseLists()` / `buildProxyGroups()`）通过 `countryGroupName()` 拼接，分类层不涉及。
- 规则集引用统一通过 `ruleSet(key, target)` 生成，保持 `RuleSetKey` 的编译期约束。
- 类型按域拆分，不要把新类型都堆进单个全局文件。

### 依赖

- 当前运行时依赖只有 `yaml`。新增运行时依赖前请先确认确有必要，并说明用途。

---

## 9. 文档同步

任何行为改动必须有配套文档。改动后请按下表检查：

| 改动类型 | 必须同步 |
| --- | --- |
| 新增/修改 URL 参数、默认值或开关行为 | `README.md` 参数说明、`src/main.ts` 顶部 banner、`docs/ARCHITECTURE.md` 的默认值说明 |
| 代理组结构、展平模式、链式代理、Tailscale 行为变化 | `README.md` 相关章节、`docs/ARCHITECTURE.md` |
| 新增或调整自定义入口 | `docs/HOW_TO_CUSTOMISE.md` |
| 开发命令、流程、规范变化 | `docs/HOW_TO_CONTRIBUTE.md` 与本文件 |
| 架构、模块职责、数据流变化 | `docs/ARCHITECTURE.md` |
| 版本更新日志 | `CHANGELOG.md` 由 git-cliff 在发布时生成，**不要手工编辑** |

> 判断标准：用户能否只读 `README.md` 就正确使用新参数/新行为？贡献者能否只读文档就知道要改什么地方？如果不能，就还需要补文档。

---

## 10. 提交与 PR

- 使用 **Conventional Commits** 前缀，`cliff.toml` 会据此生成分类日志：
  - `feat:` 新功能
  - `fix:` 缺陷修复
  - `docs:` 文档
  - `refactor:` 重构
  - `test:` 测试
  - `perf:` 性能
  - `style:` 格式调整
  - `chore:` 杂项
  - `ci:` CI 配置
  - `build:` 构建相关
  - `revert:` 回滚
- 提交信息统一使用英文，保持简短、说明「做了什么」。
- 一个提交只做一件事；功能改动与文档改动用多个提交分开。
- **不要提交** `convert.js`、`convert.min.js`、`yamls/` 或任何本地生成文件。
- PR 合并前，CI 会检查：
  - `npm run typecheck`
  - `npm run format:check`
  - `npm run lint`
  - `npm run artifacts`
- CI 不单独运行 `npm test`，请在本地确保测试通过。
- 不要直接向 `main` 强推，也不要向 `dist` / `preview` 提交。

---

## 11. 发布流程（仅限授权者）

> ⚠️ **安全与权限声明 (CRITICAL SECURITY DISCLAIMER)**
>
> ONLY agents acting on behalf of the user `powerfullz` (or the user `powerfullz` himself) are allowed to execute this release workflow. Normal contributor agents MUST NOT touch or execute the release flow under any circumstances.
>
> （仅允许代表用户 `powerfullz` 运行的 Agent 或 `powerfullz` 本人执行此发布流程。普通的贡献者 Agent 严禁触碰或执行发布流程。）

### 发布命令

```bash
npm version patch   # 向后兼容的修复
npm version minor   # 向后兼容的新功能
npm version major   # 不兼容的变更
```

### 自动执行内容

1. `preversion`：运行 `npm run lint` 与 `npm run typecheck`。
2. 更新 `package.json` / `package-lock.json` 的版本号。
3. 由于 `.npmrc` 设置了 `tag-version-prefix=src-v`，会创建形如 `src-v2.9.2` 的 Tag。
4. `version` 生命周期：运行 `scripts/changelog.mjs`，用 git-cliff 生成 `CHANGELOG.md` 并加入本次提交。
5. `postversion`：执行 `git push --follow-tags`，推送提交与 Tag。
6. Tag 推送后触发 `.github/workflows/release.yaml`（匹配 `src-v*`）：
   - 校验源码并构建产物；
   - 将产物推送到 `dist` 分支，并创建/更新 `vX.Y.Z` Tag；
   - 创建 GitHub Release；
   - 清理 jsDelivr 缓存。

### 禁止事项

- 不要手动创建 `src-v*` 或 `v*` Tag。
- 不要手动向 `dist` / `preview` 分支推送。
- 不要手工编辑 `CHANGELOG.md`。
- 普通贡献者请在 PR 合并后交由维护者发布，不要在 PR 中执行版本命令。

---

## 12. 排障

| 现象 | 原因与处理 |
| --- | --- |
| `npm run generate` 报错找不到 `convert.js` | 先生成构建产物：`npm run build` 或 `npm run artifacts` |
| 本地 YAML 没有反映最新源码 | 先 `npm run build`，再 `npm run generate`；`generate` 读取的是 `convert.js` |
| `format:check` 失败 | 运行 `npm run format` 后重新检查 |
| `lint` 报 TypeScript 版本相关错误 | 检查是否误升级/删除了 `typescript@6`；ESLint 依赖它，不能只用 TS 7 |
| `typecheck` 行为异常 | 确认使用 `npm run typecheck`（走 `typescript-native`），不要直接运行 `npx tsc` |
| 产物改动后 `git status` 看不到 | `convert.js`、`convert.min.js`、`yamls/` 已被忽略，这是预期行为 |
| 想改产物里的逻辑 | 回到 `src/` 修改源码并重新构建，不要直接编辑产物 |

---

## 提交前检查清单

- [ ] 改动只涉及源码、测试或文档，没有提交构建产物。
- [ ] `npm run format:check` 通过。
- [ ] `npm run lint` 通过。
- [ ] `npm run typecheck` 通过。
- [ ] `npm test` 通过。
- [ ] `npm run artifacts` 能成功生成产物。
- [ ] 新增/修改的 URL 参数已同步到 `README.md` 与 `src/main.ts` banner。
- [ ] 行为变化已同步到 `docs/ARCHITECTURE.md`，自定义入口变化已同步到 `docs/HOW_TO_CUSTOMISE.md`。
- [ ] 提交信息使用了 Conventional Commits 前缀，**提交信息使用英文**。
