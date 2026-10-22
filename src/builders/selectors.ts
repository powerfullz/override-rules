/**
 * 基础候选列表构建：为各策略组提供可复用的代理选项集合。
 */

import { countryGroupName, PROXY_GROUPS } from "../catalog/group-names";
import { buildList } from "../utils/primitives";
import { buildLandingExcludeFilter } from "../utils/regex";
import type {
    BaseLists,
    BuildBaseListsInput,
    ProxyGroupCandidate,
    ProxyGroupNodeSource,
    ProxyNode,
} from "../types/proxy";

/**
 * 展平模式下直接引用非落地节点。
 *
 * `regex=true` 时使用 `include-all`，并通过 `exclude-filter` 排除落地节点，
 * 避免链式代理形成循环；没有非落地节点时返回 `null`，由调用方回退到
 * 「落地节点」/「手动选择」/`DIRECT`。
 */
function buildFlattenedNodeSource(
    nodes: ProxyNode[],
    landingNodes: ProxyNode[],
    regexFilter: boolean
): ProxyGroupNodeSource | null {
    if (nodes.length === 0) return null;

    if (regexFilter) {
        return {
            "include-all": true,
            ...(landingNodes.length > 0
                ? { "exclude-filter": buildLandingExcludeFilter(landingNodes) }
                : {}),
        };
    }

    const proxies = nodes.map((node) => node.name).filter(Boolean);
    return proxies.length > 0 ? { proxies } : null;
}

/**
 * 根据功能开关和节点分类结果，构建各代理组所需的基础候选列表。
 * @param input - 详见 `BuildBaseListsInput`
 */
export function buildBaseLists({
    landing,
    landingNodes,
    lowCostNodes,
    nonLandingNodes,
    regexFilter,
    regions,
}: BuildBaseListsInput): BaseLists {
    const suffixedCountryNames = regions.groupedCountries.map(countryGroupName);
    const hasCountries = regions.groupedCountries.length > 0;
    const hasLowCost = lowCostNodes.length > 0 || regexFilter;
    const isFlattened = regions.mode === "flattened";
    const flattenedNodeSource = isFlattened
        ? buildFlattenedNodeSource(regions.flattenedNodes, landingNodes, regexFilter)
        : null;

    // 展平模式不再嵌套 AUTO / FALLBACK，直接使用非落地节点与固定兜底组。
    const defaultSelector: ProxyGroupCandidate[] = isFlattened
        ? buildList<ProxyGroupCandidate>(
              landing && PROXY_GROUPS.LANDING,
              flattenedNodeSource,
              hasLowCost && PROXY_GROUPS.LOW_COST,
              PROXY_GROUPS.MANUAL,
              "DIRECT"
          )
        : buildList<ProxyGroupCandidate>(
              PROXY_GROUPS.AUTO,
              PROXY_GROUPS.FALLBACK,
              landing && PROXY_GROUPS.LANDING,
              suffixedCountryNames,
              hasLowCost && PROXY_GROUPS.LOW_COST,
              PROXY_GROUPS.MANUAL,
              "DIRECT"
          );

    const defaultProxies = buildList(
        PROXY_GROUPS.SELECT,
        landing && PROXY_GROUPS.LANDING,
        suffixedCountryNames,
        hasLowCost && PROXY_GROUPS.LOW_COST,
        PROXY_GROUPS.MANUAL,
        "DIRECT"
    );

    const defaultProxiesDirect = buildList(
        "DIRECT",
        landing && PROXY_GROUPS.LANDING,
        suffixedCountryNames,
        hasLowCost && PROXY_GROUPS.LOW_COST,
        PROXY_GROUPS.SELECT,
        PROXY_GROUPS.MANUAL
    );

    // 保留主线的兜底决策：存在地区组时不再重复追加「手动选择」与「DIRECT」；
    // 无地区组时以「DIRECT」兜底，避免生成空 proxies（见 issue #64）。
    const defaultFallback: ProxyGroupCandidate[] = isFlattened
        ? buildList<ProxyGroupCandidate>(landing && PROXY_GROUPS.LANDING, flattenedNodeSource)
        : buildList<ProxyGroupCandidate>(
              landing && PROXY_GROUPS.LANDING,
              suffixedCountryNames,
              hasCountries ? null : "DIRECT"
          );

    // 展平模式即使启用 regex 也要显式枚举非落地节点：前置代理组不能包含落地节点，
    // 否则会和 `dialer-proxy: "前置代理"` 形成循环引用。
    const frontProxySelector = isFlattened
        ? buildList("DIRECT", regions.flattenedNodes.map((node) => node.name).filter(Boolean))
        : buildList(
              suffixedCountryNames,
              "DIRECT",
              !regexFilter && nonLandingNodes.map((node) => node.name).filter(Boolean)
          );

    return {
        defaultProxies,
        defaultProxiesDirect,
        defaultSelector,
        defaultFallback,
        frontProxySelector,
    };
}
