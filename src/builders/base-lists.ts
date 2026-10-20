/**
 * 基础候选列表构建：为各策略组提供可复用的代理选项集合。
 */

import { countryGroupName, PROXY_GROUPS } from "../catalog/group-names";
import { buildList } from "../utils/primitives";
import type { BaseLists, BuildBaseListsInput } from "../types/proxy";

/**
 * 根据功能开关和节点分类结果，构建各代理组所需的基础候选列表。
 * @param input - 详见 `BuildBaseListsInput`
 */
export function buildBaseLists({
    landing,
    lowCostNodes,
    countryNames,
    nonLandingNodes,
    regexFilter,
}: BuildBaseListsInput): BaseLists {
    const suffixedCountryNames = countryNames.map(countryGroupName);
    const hasLowCost = lowCostNodes.length > 0 || regexFilter;

    const defaultSelector = buildList(
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

    const defaultFallback = buildList(landing && PROXY_GROUPS.LANDING, suffixedCountryNames);

    const frontProxySelector = buildList(
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
