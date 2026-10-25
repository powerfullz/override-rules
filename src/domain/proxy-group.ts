/**
 * 代理组构造工厂：集中处理「地区代理组类型 → 具体字段」的映射，
 * 以及各类固定结构代理组的字段顺序，避免散落在各处。
 */

import { SPEEDTEST_URL } from "../catalog/endpoints";
import type { GroupType } from "../types/args";
import type {
    FallbackProxyGroup,
    ProxyGroup,
    ProxyGroupCandidate,
    ProxyGroupNodeSource,
    SelectProxyGroup,
    UrlTestProxyGroup,
} from "../types/proxy";

interface BuildGroupByTypeInput {
    name: string;
    icon: string;
    groupType: GroupType;
    nodeSource: ProxyGroupNodeSource;
}

/**
 * 保证节点来源非空：既没有显式 `proxies`、也没有启用 `include-all` 时，
 * 回退到 `DIRECT`，避免生成空代理组。
 */
function ensureNonEmptyNodeSource(nodeSource: ProxyGroupNodeSource): ProxyGroupNodeSource {
    if (nodeSource["include-all"]) return nodeSource;
    if (nodeSource.proxies && nodeSource.proxies.length > 0) return nodeSource;
    return { ...nodeSource, proxies: ["DIRECT"] };
}

/**
 * 将候选项合并为单个节点来源。
 *
 * 字符串视为代理组/节点名称并写入 `proxies`；对象来源（如 `include-all`）
 * 的字段与显式名称合并。结果为空时统一回退到 `DIRECT`。
 */
function normalizeNodeSource(
    candidates: ProxyGroupCandidate[],
    includeAll = false
): ProxyGroupNodeSource {
    const proxies: string[] = [];
    const nodeSource: ProxyGroupNodeSource = {};

    for (const candidate of candidates) {
        if (typeof candidate === "string") {
            proxies.push(candidate);
            continue;
        }

        if (candidate.proxies) proxies.push(...candidate.proxies);
        if (candidate["include-all"]) nodeSource["include-all"] = true;
        if (candidate.filter !== undefined) nodeSource.filter = candidate.filter;
        if (candidate["exclude-filter"] !== undefined) {
            nodeSource["exclude-filter"] = candidate["exclude-filter"];
        }
    }

    if (includeAll) nodeSource["include-all"] = true;
    if (proxies.length > 0) nodeSource.proxies = proxies;

    return ensureNonEmptyNodeSource(nodeSource);
}

/**
 * 根据地区代理组类型生成对应的代理组。
 * groupType：0=select，1=url-test，2=load-balance。
 */
export function buildGroupByType({
    name,
    icon,
    groupType,
    nodeSource,
}: BuildGroupByTypeInput): ProxyGroup {
    const source = normalizeNodeSource([nodeSource]);

    switch (groupType) {
        case 0:
            return { name, icon, type: "select", ...source };
        case 1:
            return {
                name,
                icon,
                type: "url-test",
                url: SPEEDTEST_URL,
                interval: 60,
                tolerance: 20,
                ...source,
            };
        case 2:
            return {
                name,
                icon,
                type: "load-balance",
                strategy: "sticky-sessions",
                url: SPEEDTEST_URL,
                interval: 60,
                tolerance: 20,
                ...source,
            };
    }
}

/** 构造一个手动选择的代理组。 */
export function selectGroup(
    name: string,
    icon: string,
    candidates: ProxyGroupCandidate[],
    includeAll = false,
    hidden: boolean = false
): SelectProxyGroup {
    return {
        name,
        icon,
        type: "select",
        ...(hidden ? { hidden: true } : {}),
        ...normalizeNodeSource(candidates, includeAll),
    };
}

/**
 * 构造一个由内核动态填充全部节点的选择组。
 *
 * 适用于 regex 模式：静态配置无法预知真实节点名称，
 * 使用 `include-all` 可让 Mihomo 在运行时把订阅节点加入该组。
 */
export function selectAllGroup(
    name: string,
    icon: string,
    excludeFilter?: string
): SelectProxyGroup {
    return {
        name,
        icon,
        type: "select",
        "include-all": true,
        ...(excludeFilter ? { "exclude-filter": excludeFilter } : {}),
    };
}

/** 构造一个自动测速的代理组。 */
export function urlTestGroup(
    name: string,
    icon: string,
    candidates: ProxyGroupCandidate[]
): UrlTestProxyGroup {
    return {
        name,
        icon,
        type: "url-test",
        url: SPEEDTEST_URL,
        ...normalizeNodeSource(candidates),
        interval: 60,
        tolerance: 20,
    };
}

/** 构造一个故障转移的代理组。 */
export function fallbackGroup(
    name: string,
    icon: string,
    candidates: ProxyGroupCandidate[]
): FallbackProxyGroup {
    return {
        name,
        icon,
        type: "fallback",
        url: SPEEDTEST_URL,
        ...normalizeNodeSource(candidates),
        interval: 60,
        tolerance: 20,
    };
}
