# 草案：地区节点组的展平与空缺处理

> 状态：**已实现**。关联 issue：[#64](https://github.com/powerfullz/override-rules/issues/64)

## 背景

issue #64 反馈：`故障转移`（FALLBACK）报 `use or proxies missing`。

根因是 `defaultFallback` 在「无落地节点且无任何地区组」时算出空数组，导致
AUTO / FALLBACK 生成空的 `proxies`。本轮已用方案 1 做了临时修复（见文末「历史」），
本文档定稿的是更彻底的目标行为。

## 最终规则

以通过 `threshold` 过滤后的地区数量作为判定依据：

```ts
activeRegions = getActiveCountryNames(countryNodes, threshold)

activeRegions.length >= 2  → 分组模式（维持现状）
activeRegions.length <  2  → 展平模式
```

展平模式下：

- 不生成任何国家/地区组；
- `选择代理` / `自动选择` / `故障转移` 直接使用非落地节点，不再引用地区组；
- 若存在落地节点，额外引用 `落地节点` 组；
- 不再生成 `手动选择` 组（其候选与 `选择代理` 高度重合）；
- 服务代理组不再引用 `选择代理`，而是直接使用同一份展平节点来源；
- 若存在「低倍率节点」组，「静态资源」组会将其置于候选首位，其余候选保持正常顺序；
- 保留 `落地节点`、`前置代理`、`低倍率节点`、`Tailscale` 及服务代理组；
- `regex=true` 时，非落地节点部分使用 `include-all`，而不是枚举节点名。

## 落地节点的判断

当前 `landing` 多了一个 `nonLandingNodes.length > 0` 条件，导致「只有落地节点」时
不会生成 `落地节点` / `前置代理` 组。本次直接删除该条件：

```ts
// 修改前
const landing = landingNodes.length > 0 && nonLandingNodes.length > 0;

// 修改后
const landing = landingNodes.length > 0;
```

`landing` 的含义变为「只要出现落地节点就启用落地相关代理组」。
`scopedNodes = landing ? nonLandingNodes : nodes` 保持不变，因此：

- 有落地节点时，地区分类只扫描非落地节点；
- 全落地场景下 `scopedNodes` 为空，`countryNames` 为空，自动进入展平模式；
- `落地节点` 组与 `前置代理` 组照常生成；
- 全落地时 `前置代理` 组没有非落地候选，只保留 `DIRECT`，这是预期行为。

## 已确认的决策

| 问题 | 决策 |
|------|------|
| 展平模式下包含哪些节点 | 非落地节点；链式代理时额外引用 `落地节点` 组 |
| 手动选择组 | 展平模式不生成（与 `选择代理` 高度重合）；分组模式保留现状（`allNames`，包含落地节点） |
| `regex=true` 时如何处理动态节点 | 非落地节点部分使用 `include-all` |
| 只有 1 个地区达标时 | 同样展平，取消该地区组 |
| 服务组目标地区未建组时 | 回退 `defaultProxies` / `defaultProxiesDirect`；展平模式下这两个列表直接使用展平节点来源，不再引用 `选择代理` |
| 存在低倍率节点组时 | 「静态资源」组优先使用 `低倍率节点`，其余候选保持正常顺序 |
| 全落地节点时 | 生成 `落地节点` 组；`前置代理` 组仅含 `DIRECT` |
| `threshold=1` 且地区数 ≥ 2 | 单节点地区继续生成单节点组 |
| `threshold=1` 且地区数 = 1 | 仍按主规则展平 |

### 行为对照

| 达标地区数 | 地区组 | 手动选择 | AUTO / FALLBACK 候选 | 选择代理候选 |
|---|---|---|---|---|
| 0 | 无 | 无 | 落地节点? + 非落地节点 | 落地节点? + 非落地节点 + 低倍率? + DIRECT |
| 1 | 无 | 无 | 同上 | 同上 |
| ≥2 | 每个地区一个 | 有 | 落地节点? + 地区组 | AUTO + FALLBACK + 落地节点? + 地区组 + 低倍率? + 手动选择 + DIRECT |

说明：

- 展平模式下 `选择代理` 不再嵌套 `自动选择` / `故障转移`，而是直接列出节点。
- `自动选择` / `故障转移` 仍共用 `defaultFallback`。
- 列表层不再主动追加 `DIRECT`；当 `defaultFallback` 为空时，由
  `domain/proxy-group.ts` 的构造工厂统一补 `DIRECT`。
- 低倍率组继续保留；展平只影响「地区组」和三大核心组的候选来源。

## 数据模型

在分类阶段一次性产出「真正会生成组的地区」与「被展平的节点」，避免构建层重复判断：

```ts
export interface RegionLayout {
    mode: "grouped" | "flattened";
    /** 真正会生成地区组的地区（mode 为 grouped 时非空）。 */
    groupedCountries: string[];
    /** 展平模式下直接进入上层列表的非落地节点。 */
    flattenedNodes: ProxyNode[];
}
```

`NodeAnalysis` 增加 `regionLayout: RegionLayout`。

- `mode = activeRegions.length >= MIN_REGION_GROUPS ? "grouped" : "flattened"`
- `groupedCountries = mode === "grouped" ? activeRegions : []`
- `flattenedNodes = mode === "flattened" ? nonLandingNodes : []`
- `countryNames` 仍保留为「通过阈值过滤的地区」原始结果；所有**代理组引用**
  统一改用 `regionLayout.groupedCountries`。

`MIN_REGION_GROUPS = 2` 作为分类层的具名常量，不新增 URL 参数。

## 候选列表构造

### 分组模式

维持现有逻辑，使用 `regionLayout.groupedCountries` 生成 `${地区}节点` 组名。

### 展平模式

节点部分按 `regex` 分支：

```ts
// regex=false：显式枚举非落地节点名
const nodeSource = { proxies: flattenedNodes.map((node) => node.name) };

// regex=true：include-all + 排除落地节点
const nodeSource = {
    "include-all": true,
    ...(landingNodes.length > 0
        ? { "exclude-filter": buildLandingExcludeFilter(landingNodes) }
        : {}),
};
```

- `buildLandingExcludeFilter()` 对落地节点名做正则转义并锚定完整名称，
  避免节点名中的 `.`、`(`、`|` 等字符破坏过滤表达式。
- 若 `flattenedNodes` 为空（全落地或空订阅），不要生成空的 `include-all`：
  `选择代理` 回退到 `[落地节点?, DIRECT]`；`自动选择` / `故障转移`
  只保留 `[落地节点?]`，若仍为空则由构造层补 `DIRECT`。
- `手动选择` 组仅在分组模式生成；`regex=true` 时沿用主线决策使用 `include-all`；
  非 regex 模式直接把 `allNames` 交给工厂，空数组由构造层回退为 `[DIRECT]`。

三个主组的列表：

```ts
const defaultSelector = buildList(
    landing && PROXY_GROUPS.LANDING,
    nodeSource,
    hasLowCost && PROXY_GROUPS.LOW_COST,
    "DIRECT"
);

const defaultFallback = buildList(
    landing && PROXY_GROUPS.LANDING,
    nodeSource
);
```

`defaultFallback` 沿用主线的兜底策略：分组模式有地区组时不追加 `手动选择` /
`DIRECT`；展平模式没有地区组时也不在列表层追加 `DIRECT`。最终若候选为空，
由 `domain/proxy-group.ts` 的构造工厂统一补 `DIRECT`。

`defaultProxies` / `defaultProxiesDirect` 在分组模式下保持现有结构；展平模式下也使用
同一份 `nodeSource`，不再引用地区组、`手动选择` 或 `选择代理`：

```ts
const defaultProxies = buildList(
    landing && PROXY_GROUPS.LANDING,
    nodeSource,
    hasLowCost && PROXY_GROUPS.LOW_COST,
    "DIRECT"
);

const defaultProxiesDirect = buildList(
    "DIRECT",
    landing && PROXY_GROUPS.LANDING,
    nodeSource,
    hasLowCost && PROXY_GROUPS.LOW_COST
);
```

因此 `BaseLists.defaultProxies` / `defaultProxiesDirect` 以及服务组的 `proxies()`
返回值都必须是 `ProxyGroupCandidate[]`，以承载 `include-all` 节点来源。

### 前置代理组

- 分组模式：保持现有逻辑。
- 展平模式：`frontProxySelector` 显式使用 `[DIRECT, ...非落地节点名]`，
  即使 `regex=true` 也不使用 `include-all`。
- 原因：`前置代理` 组不能包含落地节点，否则会形成 `dialer-proxy` 循环引用。
- 全落地时该列表自然退化为 `[DIRECT]`。

## 实现落点

| 位置 | 改动 |
|------|------|
| `src/analysis/classify.ts` | `landing` 删除 `nonLandingNodes.length > 0`；派生 `regionLayout` |
| `src/types/proxy.ts` | 新增 `RegionLayout`，`NodeAnalysis` 增加字段；基础列表入参增加 `regions` / `landingNodes`；`defaultProxies` / `defaultProxiesDirect` 改为 `ProxyGroupCandidate[]` |
| `src/domain/proxy-group.ts` | 统一 `ProxyGroupNodeSource`，让 `selectGroup` / `urlTestGroup` / `fallbackGroup` 支持 `include-all`；空候选统一回退 `DIRECT` |
| `src/builders/selectors.ts` | 分组与展平分支；显式节点名 / `include-all`；展平模式移除 `手动选择` 与 `选择代理` 引用 |
| `src/builders/proxy-groups.ts` | 展平模式跳过地区组与 `手动选择` 组；AUTO / FALLBACK 共用 `defaultFallback` |
| `src/catalog/service-groups.ts` | `BILIBILI` / `BAHAMUT` / `TRUTH_SOCIAL` 改按 `groupedCountries` 判断；`proxies()` 返回 `ProxyGroupCandidate[]`；`静态资源` 在低倍率组存在时将其置顶 |
| `src/main.ts` | 向 `buildBaseLists` 传入 `regions` 与 `landingNodes` |
| `README.md` / `docs/ARCHITECTURE.md` | 同步展平、`regex`、`threshold` 与 landing 行为说明 |
| `tests/` | 覆盖 0 / 1 / ≥2 地区、`threshold=1`、landing、regex、空 `proxies` |

### 必须一并处理的引用链

1. **`手动选择` / `选择代理` 的引用**
   - `selectors.ts` 中的 `defaultSelector` / `defaultProxies` / `defaultProxiesDirect` 在展平模式下必须移除 `手动选择`；
   - `defaultProxies` / `defaultProxiesDirect` 还必须移除 `选择代理`，直接携带展平 `nodeSource`，
     否则服务组只是从「引用地区组」变成「引用一个已展平的组」，并没有真正展平；
   - `service-groups.ts` 中的 `BAHAMUT` / `TRUTH_SOCIAL` 只有在分组模式才会引用 `手动选择`，
     展平模式回退列表已不含它。
2. **服务组的地区判断**
   - 目前按 `countryNames` 判断；展平后仍会引用不存在的 `台湾节点` / `美国节点`，
     因此必须改为按 `groupedCountries` 判断。
   - `BAHAMUT` / `TRUTH_SOCIAL` 在目标地区未建组时回退到 `defaultProxies`；
     `BILIBILI` 回退到 `defaultProxiesDirect`。
3. **`regex=true` + landing 的前置代理**
   - 展平模式必须显式写入非落地节点名，不能使用 `include-all`。
4. **空节点兜底**
   - 候选列表允许为空，`domain/proxy-group.ts` 的构造工厂在既无显式 `proxies`
     又未启用 `include-all` 时统一补入 `[DIRECT]`；
   - 因此空订阅时 `选择代理` 为 `[DIRECT]`，`自动选择` / `故障转移` 均为
     `[DIRECT]`，展平模式也不会生成 `手动选择` 组，不会产生空组。

## 边界与非目标

- 不新增 URL 参数，`threshold` 语义保持不变；
- 不保留草案早期提出的「地区组 ≥ 2 时逐地区展平单节点地区」；
- `threshold=1` 且地区数 ≥ 2 时，单节点地区仍会生成单节点组；
- `threshold=1` 且地区数 = 1 时，仍按 `< 2` 规则展平；
- Tailscale 节点虽然属于非落地节点，但不会进入展平候选或常规选择列表，仅保留 Tailscale 组并通过定向规则使用；
- 上游节点名与既有代理组重名的风险与当前「手动选择」枚举节点名时一致，不在本次处理范围；
- `regex=true` 使用 `include-all` 时，运行时会包含 provider 节点，可能多于转换时的
  `config.proxies`；这是 regex 模式的预期行为；
- 落地节点的 `exclude-filter` 依赖节点名称；若动态 provider 后续新增落地节点，
  需要重新执行转换才能排除；
- 静态 YAML 生成器使用的 `fake_proxies.json` 含 5 个地区，实际产物仍走分组模式，
  但展平分支仍需单元测试覆盖。

## 测试计划

- `tests/analysis/classify.test.ts`：
  - 现有数据只有香港达标，应断言进入展平模式；
  - 补 0 / 1 / ≥2 地区、`threshold=1`、全落地场景；
  - 断言 `regionLayout.groupedCountries` / `flattenedNodes`。
- `tests/builders/base-lists.test.ts`：
  - 展平模式的选择列表包含非落地节点与 `DIRECT`，不包含 `手动选择` 或地区组名；
    AUTO / FALLBACK 包含非落地节点，不包含地区组名；
  - 分组模式维持主线的兜底结构；
  - `regex=true` 时包含 `include-all`，有落地节点时包含 `exclude-filter`；
  - 基础列表允许为空，空候选由代理组构造层兜底。
- `tests/builders/config.test.ts`：
  - 更新 #64 回归用例：节点名直接出现在 SELECT / AUTO / FALLBACK 中；
  - 展平模式下服务组直接包含展平节点，不出现 `选择代理` 引用；
  - 只有台湾 / 只有美国时，BAHAMUT / TRUTH_SOCIAL 不产生悬空地区组引用，
    BILIBILI / TRUTH_SOCIAL 直接使用对应节点名；
  - 空 `proxies` 时 AUTO / FALLBACK / 服务组至少含 `DIRECT`；
  - 全落地时仍生成 `落地节点` 组，`前置代理` 仅含 `DIRECT`，服务组使用
    `落地节点` / `DIRECT`；
  - regex + landing 时前置代理仍包含非落地节点名，服务组使用 `include-all` +
    `exclude-filter`。
- 提交前运行 `npm run artifacts` 做全量校验。

## 历史

### 方案 1（已落地）

`defaultFallback` 末尾固定追加 `手动选择` 与 `DIRECT` 兜底，保证任何订阅下
AUTO / FALLBACK 都非空，立即消除 #64 的启动报错。该临时修复后来被展平模式取代；
当前空候选的最终兜底统一由 `domain/proxy-group.ts` 的构造工厂负责。
