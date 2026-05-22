import { PROXY_GROUPS } from "./constants";
import { buildList } from "./utils";
import type { BaseLists, BuildBaseListsInput } from "./types";

/**
 * 根据当前功能开关和节点信息，构建各代理组所需的基础代理列表。
 * @param input - 构建基础列表所需的输入参数
 * @param input.landing - 是否启用落地节点模式
 * @param input.lowCostNodes - 低价节点名称列表
 * @param input.countryGroupNames - 带后缀的地区分组名称列表
 * @param input.nonLandingNodes - 非落地节点名称列表（仅在非正则过滤模式下使用）
 * @param input.regexFilter - 是否使用正则过滤模式
 * @returns 包含各场景下代理列表的 `BaseLists` 对象
 */
export function buildBaseLists({
    landing,
    lowCostNodes,
    countryGroupNames,
    nonLandingNodes,
    regexFilter,
}: BuildBaseListsInput): BaseLists {
    const lowCost = lowCostNodes.length > 0 || regexFilter;

    const defaultSelector = buildList(
        PROXY_GROUPS.AUTO,
        PROXY_GROUPS.FALLBACK,
        landing && PROXY_GROUPS.LANDING,
        countryGroupNames,
        lowCost && PROXY_GROUPS.LOW_COST,
        PROXY_GROUPS.MANUAL,
        "DIRECT"
    );

    const defaultProxies = buildList(
        PROXY_GROUPS.SELECT,
        landing && PROXY_GROUPS.LANDING,
        countryGroupNames,
        lowCost && PROXY_GROUPS.LOW_COST,
        PROXY_GROUPS.MANUAL,
        "DIRECT"
    );

    const defaultProxiesDirect = buildList(
        "DIRECT",
        landing && PROXY_GROUPS.LANDING,
        countryGroupNames,
        lowCost && PROXY_GROUPS.LOW_COST,
        PROXY_GROUPS.SELECT,
        PROXY_GROUPS.MANUAL
    );

    const defaultFallback = buildList(landing && PROXY_GROUPS.LANDING, countryGroupNames);

    const frontProxySelector = buildList(
        countryGroupNames,
        "DIRECT",
        !regexFilter && nonLandingNodes
    );

    return {
        defaultProxies,
        defaultProxiesDirect,
        defaultSelector,
        defaultFallback,
        frontProxySelector,
    };
}
