# 如何自定义专属覆写规则

本项目的设计初衷是提供一套高度灵活且开箱即用的 Mihomo/Substore 覆写规则。如果默认的代理组、分流规则或参数设定不满足你的需求，你可以轻松 Fork 本仓库并进行定制。

## Fork 并准备开发环境

首先，将本仓库 Fork 到你的 GitHub 账号下，然后克隆到本地：

```bash
git clone https://github.com/你的用户名/override-rules.git
cd override-rules
npm install
```

我们使用 TypeScript 进行源码管理，所有的核心逻辑都在 `src/` 目录中。**请务必不要直接修改根目录下的 `.js` 和 `.yaml` 产物文件**。

类型检查由 TypeScript 7 原生编译器执行（`npm run typecheck`）；`devDependencies` 中的 `typescript` 6 仅作为 `typescript-eslint` 的运行时（该插件尚不兼容 TypeScript 7 的 API），不参与项目类型检查。构建阶段由 esbuild 完成 TypeScript 的类型擦除和打包，YAML 生成器由 `tsx` 执行。

## 自定义默认的脚本参数

通过 URL 传递参数（如 `#fakeip=true`）是控制脚本行为的常用方式。各参数的默认值集中在 `src/args/schema.ts` 的 `ARG_DEFAULTS` 中；布尔开关的默认值则在 `src/args/parse.ts` 的 `buildFeatureFlags` 里通过解析函数的第二个参数指定。

例如，要默认开启 IPv6 支持：

```typescript
// src/args/parse.ts
export function buildFeatureFlags(args: ScriptArgs): FeatureFlags {
    return {
        groupType: parseGroupType(args),
        ipv6Enabled: parseBool(args.ipv6, true), // 例如：改为 true 即可默认开启 IPv6
        // ...
    };
}
```

而 `grouptype`、`threshold`、`fakeip` 这类带类型语义的默认值，直接修改 `src/args/schema.ts`：

```typescript
// src/args/schema.ts
export const ARG_DEFAULTS = {
    groupType: 1, // 0=select，1=url-test，2=load-balance
    countryThreshold: 2,
    fakeIPEnabled: true,
} as const;
```

## 调整代理组

如果你需要调整生成的代理组（Proxy Groups），或需要添加新的国家/地区节点分组，请编辑 `src/catalog/group-names.ts`、`src/catalog/icons.ts` 与 `src/catalog/service-groups.ts`。

**添加新的代理组名称：**

```typescript
// src/catalog/group-names.ts
export const PROXY_GROUPS = {
    // ... 已有代理组 ...
    MY_CUSTOM_GROUP: "自定义代理组",
} as const;
```

**（可选）为该组登记图标：**

```typescript
// src/catalog/icons.ts
export const ICONS = {
    // ... 已有图标 ...
    myCustomGroup: `${QURE}/MyIcon.png`,
} as const;
```

**定义新的服务代理组：**

服务代理组采用声明式目录，在 `src/catalog/service-groups.ts` 的 `serviceGroups` 数组中新增一条记录即可，**无需改动任何组装逻辑**：

```typescript
// src/catalog/service-groups.ts
export const serviceGroups: ServiceGroupDef[] = [
    // ... 已有服务组 ...
    {
        name: PROXY_GROUPS.MY_CUSTOM_GROUP,
        icon: ICONS.myCustomGroup,
        // ctx 包含 flags / nodes / lists，可按需挑选候选代理
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
];
```

## 调整国家/地区匹配规则

脚本会根据`countriesMeta`自动生成实际存在的代理组，因此只需修改国家/地区元数据即可。

在 `src/catalog/countries.ts` 的 `countriesMeta` 中，你可以修改节点的正则匹配 `pattern` 以及代理组显示的 `icon`。`weight` 用于控制代理组在列表中的排序（越小越靠前）。

```typescript
// src/catalog/countries.ts
export const countriesMeta: Record<string, CountryMeta> = {
    // ...
    印度尼西亚: {
        pattern: "印尼|ID|Indonesia|🇮🇩",
        icon: "图标链接",
        weight: 0, // 示例：放在最前面
    },
};
```

## 自定义分流规则 (`rule-providers`和`rules`)

若需要添加新的 Rule Provider（例如引入其他 GitHub 仓库或第三方链接的规则集），请在 `src/catalog/rule-sets.ts` 中配置：

```typescript
// src/catalog/rule-sets.ts
export const ruleSets = {
    // ...
    exampleProvider: {
        type: "http",
        behavior: "domain",
        format: "text",
        interval: 86400,
        url: "https://example.com/custom_rules.txt",
        path: "./ruleset/MyCustomProvider.txt",
    },
} satisfies Record<string, RuleProvider>;
```

接着，在 `src/builders/rules.ts` 中将流量分配至对应的代理组。规则集名称通过 `ruleSet()` 生成，其键受 `RuleSetKey` 类型约束，写错会在编译期报错：

```typescript
// src/builders/rules.ts
import { PROXY_GROUPS } from "../catalog/group-names";
import { ruleSet } from "../catalog/rule-sets";

// 在 buildRules() 返回的数组中：
ruleSet("exampleProvider", PROXY_GROUPS.MY_CUSTOM_GROUP),
// 如果没有在 group-names 中添加新代理组，也可以直接用 PROXY_GROUPS.SELECT 等
```

### 使用 GeoSite 数据库

参考[v2fly/domain-list-community](https://github.com/v2fly/domain-list-community)仓库以获取你所需要的域名集合名称，并直接修改 `src/builders/rules.ts` 即可。

```ts
// src/builders/rules.ts
// 在 buildRules() 返回的数组中！
`GEOSITE,CATEGORY-PORN,${PROXY_GROUPS.MY_CUSTOM_GROUP}`,    // 示例：添加成人内容集合，GeoSite 规则大小写不敏感。
// 如果没有在 group-names 中添加新代理组，也可以直接用现有的 PROXY_GROUPS.SELECT 等
```

## 构建并使用你的定制脚本

在修改完成后，你可以先在本地运行构建命令来验证你的更改是否正确：

```bash
# 格式化并检查代码
npm run format
npm run lint:fix

# 运行单元测试
npm test

# 本地验证构建产物（可选）
npm run artifacts
```

**重要**：本项目已经配置了 GitHub Actions 来自动处理构建和发布，所有的产物（包括 `.js` 脚本和 `.yaml` 配置文件）会被自动构建并部署到 `dist` 分支。因此，**请勿直接将本地生成的产物推送到主分支**。

请按照以下步骤发布并使用你的定制版本：

1. **启用 GitHub Actions**：由于你使用的是 Fork 后的仓库，请前往你仓库的 **Actions** 标签页，点击 "I understand my workflows, go ahead and enable them" 以启用自动化工作流。
2. **提交代码**：将你修改后的源码（如 `src/` 下的内容）提交并推送到你的 GitHub 仓库。
3. **触发发布**：通过创建并推送 Tag 来触发自动构建和发布。推荐使用以下命令自动增加版本号并推送 Tag：
   ```bash
   npm version patch
   ```
   > **注意**：由于 `package.json` 中配置了相关的生命周期钩子，上述命令会自动运行代码测试、更新版本号、生成更新日志（CHANGELOG），并将带有标签的提交推送至远程仓库以触发 CI 工作流。
4. **等待自动构建**：回到 GitHub 仓库的 Actions 页面，等待名为 "Release Artifacts" 的工作流执行完毕。该工作流会自动将编译压缩后的最终产物推送到 `dist` 分支。
5. **获取并使用定制脚本**：构建成功后，你可以通过 jsDelivr 引用指向 `dist` 分支的覆写脚本。例如，在 Substore 中配置如下链接（注意将“你的用户名”替换为实际的 GitHub 用户名）。

```text
https://cdn.jsdelivr.net/gh/你的用户名/override-rules@dist/convert.min.js
```

若不能接受 JSDelivr 的缓存和更新延迟，则直接使用 Github Raw 链接：

```text
https://raw.githubusercontent.com/你的用户名/override-rules/refs/heads/dist/convert.min.js
```
