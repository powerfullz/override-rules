# 草案：地区节点组的展平与空缺处理

> 状态：**草案 / 待讨论**，暂未实现。本文件用于 review，确认后再进入实现。
> 关联 issue：[#64](https://github.com/powerfullz/override-rules/issues/64)

## 背景

issue #64 反馈：`故障转移`（FALLBACK）报 `use or proxies missing`。

根因是 `defaultFallback` 在「无落地节点且无任何地区组」时算出空数组，导致
AUTO / FALLBACK 生成空的 `proxies`。**本轮已用方案 1 做了临时修复**（见下），
本草案讨论的是更彻底的目标行为。

## 现状（临时修复后）

- `countryNames` = 节点数 ≥ `threshold`（默认 2）的地区。
- 每个地区生成 `${地区}节点` 组。
- `defaultFallback` = `[落地节点?, ...地区组名, 手动选择, DIRECT]`。

临时修复（方案 1）只保证列表**非空**，但没有回答「什么时候该显示 / 不该显示」的问题。

## 目标行为（待实现）

1. **无任何地区组时**：依赖地区聚合的组不应「空着显示」。
2. **某地区只有 1 个节点时**：放弃该地区组，把节点**展平**到上层列表，
   而不是为单个节点建一个组。

## 提议方案

### 情形 A：完全没有地区组（且无落地节点）

`自动选择` / `故障转移` 的语义就是「在多个地区组之间自动挑选」。
若一个地区组都没有，这两个组没有存在意义：

- **不生成** `自动选择` / `故障转移`。
- 相应地，`defaultSelector` 也不再引用它们。
- 规则层当前不直接引用这两个组，无需改动规则。

> 待确认：也可保留它们但仅含 `手动选择 / DIRECT`。草案倾向「不生成」，语义更干净。

### 情形 B：某地区只有 1 个节点

- 不为该地区生成 `${地区}节点` 组。
- 将该节点的**名称**直接并入上层列表（展平），例如：
  - `defaultSelector` / `defaultProxies` / `defaultFallback` 中出现该节点名，而非「XX节点」组名。
- 影响：需要把「地区组名列表」与「被展平的节点名列表」分开计算，
  在 `buildBaseLists()` 中分别参与拼接。

示意（伪代码）：

```ts
const grouped = countryNames.filter((c) => countryNodes[c].length >= 2); // 生成组
const flattened = countryNames
    .filter((c) => countryNodes[c].length === 1)
    .flatMap((c) => countryNodes[c].map((n) => n.name)); // 展平
```

### 与 `threshold` 的关系

- `threshold`（默认 2）目前决定「是否生成地区组」。
- 本方案下：`threshold` 仍决定地区的**归类下限**，而「1 个节点」的情形
  总是走展平分支（即便用户显式设置 `threshold=1`）。

## 影响面

| 位置 | 需要改动 |
|------|----------|
| `src/builders/base-lists.ts` | 分离「地区组名」与「展平节点名」，并让条件组引用保持正确 |
| `src/builders/proxy-groups.ts` | 情形 A 下跳过 AUTO/FALLBACK；情形 B 下跳过单节点地区组 |
| `src/analysis/` | 可考虑在分类阶段就产出 `groupedCountries` / `flattenedNodes` |
| `src/catalog/service-groups.ts` | BILIBILI/BAHAMUT/TRUTH_SOCIAL 引用了 `${地区}节点`，需适配展平情形 |
| `scripts/yaml_generator/generator.ts` | 静态 YAML 用正则模式，需确认展平逻辑与其兼容 |
| `tests/` | 新增情形 A / B 的用例 |

## 待决问题

1. **regex 模式的冲突**：`regex: true` 时地区组用 `include-all + filter`，本意是让内核
   在运行时过滤动态节点；而「展平单个节点」需要写死节点名，二者语义冲突。
   需决定：regex 模式下是否跳过展平、还是改用不同的过滤表达式。
2. **情形 A 的最终形态**：不生成 AUTO/FALLBACK，还是保留但仅含兜底候选？
3. **多节点但同地区都要展平的边界**：例如 `threshold` 调高时是否也展平？
4. 展平后节点名是否会与既有代理组重名（命名冲突）。
5. 对下游引用（BILIBILI/BAHAMUT 等）的兼容策略。

## 本轮已落地（方案 1）

`defaultFallback` 末尾固定追加 `手动选择` 与 `DIRECT` 兜底，
保证任何订阅下 AUTO / FALLBACK 都非空，立即消除 #64 的启动报错。
等本草案定稿后再替换为上述目标行为。