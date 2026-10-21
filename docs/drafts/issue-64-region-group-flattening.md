# 草案：地区节点组的展平与空缺处理

> 状态：**方案已定稿 / 代码待实现**。关联 issue：[#64](https://github.com/powerfullz/override-rules/issues/64)

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
- 不生成「手动选择」组；
- 「选择代理」「自动选择」「故障转移」直接使用
  `[落地节点组（若存在）, ...所有非落地节点名, DIRECT]`；
- 保留「落地节点」「前置代理」「低倍率节点」「Tailscale」及服务代理组；
- 即使 `regex=true`，展平模式下仍写死节点名，不使用 `include-all`。

### 已确认的决策

| 问题 | 决策 |
|------|------|
| 展平模式下包含哪些节点 | 非落地节点；链式代理时保留「落地节点」组 |
| `regex=true` 时如何处理动态节点 | 仍显式枚举节点名，不使用 `include-all` |
| 只有 1 个地区达标时（如香港 50 个、美国 1 个，`threshold=2`） | 同样展平，取消香港组 |
| 地区组 ≥ 2 时是否仍展平单节点地区 | 不保留；只做全局 `< 2` 展平 |

### 行为对照

| 达标地区数 | 地区组 | 手动选择 | AUTO / FALLBACK 候选 | 选择代理候选 |
|---|---|---|---|---|
| 0 | 无 | 无 | 落地节点? + 非落地节点名 + DIRECT | AUTO + FALLBACK + 落地节点? + 非落地节点名 + 低倍率? + DIRECT |
| 1 | 无 | 无 | 同上 | 同上 |
| ≥2 | 每个地区一个 | 有 | 落地节点? + 地区组 + 手动选择 + DIRECT | AUTO + FALLBACK + 落地节点? + 地区组 + 低倍率? + 手动选择 + DIRECT |

低倍率组继续保留；展平只影响「地区组 / 手动选择 / 三大核心组」。

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

`NodeAnalysis` 增加 `regionLayout: RegionLayout`；`countryNames` 仍保留为
「通过阈值过滤的地区」原始结果，但所有**代理组引用**统一改用 `regionLayout.groupedCountries`。

`MIN_REGION_GROUPS = 2` 作为分类层的具名常量，不新增 URL 参数。

## 实现落点

| 位置 | 改动 |
|------|------|
| `src/analysis/classify.ts` | 在 `countryNames` 之后派生 `regionLayout` |
| `src/types/proxy.ts` | 新增 `RegionLayout`，`NodeAnalysis` 增加字段 |
| `src/builders/base-lists.ts` | 分开拼接「地区组名」与「展平节点名」；`MANUAL` 仅在分组模式加入 |
| `src/builders/proxy-groups.ts` | 展平模式下跳过 `MANUAL` 与地区组；AUTO / FALLBACK 继续共用 `defaultFallback` |
| `src/catalog/service-groups.ts` | `BILIBILI` / `BAHAMUT` / `TRUTH_SOCIAL` 改按 `groupedCountries` 判断 |
| `src/main.ts` | 向 `buildBaseLists` 传入 `regions: nodes.regionLayout` |
| `tests/` | 覆盖 0 / 1 / ≥2 地区、threshold、landing、regex、空 proxies |
| `README.md` / `docs/ARCHITECTURE.md` | 同步展平行为说明 |

### 必须一并处理的引用链

1. **`手动选择` 的引用**
   - `base-lists.ts` 中的 `defaultSelector` / `defaultProxies` / `defaultProxiesDirect` / `defaultFallback`；
   - `service-groups.ts` 中的 `BAHAMUT` / `TRUTH_SOCIAL`。
2. **服务组的地区判断**
   - 目前按 `countryNames` 判断；若只有台湾或美国达标，展平后仍会引用不存在的
     `台湾节点` / `美国节点`，因此必须改为按 `groupedCountries` 判断。
3. **`regex=true` + landing 的前置代理**
   - 现有 `frontProxySelector` 在 regex 下只列地区组名；展平后地区组消失会退化成
     `[DIRECT]`。展平模式必须显式写入非落地节点名。
4. **空节点兜底**
   - `proxies` 为空时展平结果为空，三大组退化为 `[DIRECT]`，避免重现 #64。

## 边界与非目标

- 不新增 URL 参数，`threshold` 语义保持不变；
- 不保留草案早期提出的「地区组 ≥ 2 时逐地区展平单节点地区」；
- Tailscale 节点属于非落地节点，展平模式下会直接出现在三大组中，同时保留 Tailscale 组；
- 上游节点名与既有代理组重名的风险与当前「手动选择」枚举节点名时一致，不在本次处理范围；
- 静态 YAML 生成器使用的 `fake_proxies.json` 含 5 个地区，实际产物仍走分组模式，
  但展平分支仍需单元测试覆盖。

## 测试计划

- `tests/analysis/classify.test.ts`：现有数据只有香港达标，应断言进入展平模式；
  另补 0 / 1 / ≥2 地区及 landing 场景。
- `tests/builders/base-lists.test.ts`：展平模式不含 `手动选择`，包含节点名与 `DIRECT`；
  分组模式维持现状。
- `tests/builders/config.test.ts`：
  - 更新 #64 回归用例：节点名直接出现在 SELECT / AUTO / FALLBACK 中；
  - 只有台湾 / 只有美国时，BAHAMUT / TRUTH_SOCIAL 不产生悬空地区组引用；
  - 空 `proxies` 时 AUTO / FALLBACK 至少含 `DIRECT`；
  - regex + landing 时前置代理仍包含非落地节点名。
- 提交前运行 `npm run artifacts` 做全量校验。

## 历史

### 方案 1（已落地）

`defaultFallback` 末尾固定追加 `手动选择` 与 `DIRECT` 兜底，保证任何订阅下
AUTO / FALLBACK 都非空，立即消除 #64 的启动报错。该临时修复会在本方案实现后被
展平模式取代。
