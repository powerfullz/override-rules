/**
 * 代理组构造工厂：集中处理「地区代理组类型 → 具体字段」的映射，
 * 以及各类固定结构代理组的字段顺序，避免散落在各处。
 */

import { SPEEDTEST_URL } from "../catalog/endpoints";
import type { GroupType } from "../types/args";
import type {
    FallbackProxyGroup,
    ProxyGroup,
    SelectProxyGroup,
    UrlTestProxyGroup,
} from "../types/proxy";

type NodeSource = Pick<ProxyGroup, "proxies" | "include-all" | "filter" | "exclude-filter">;

interface BuildGroupByTypeInput {
    name: string;
    icon: string;
    groupType: GroupType;
    nodeSource: NodeSource;
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
    switch (groupType) {
        case 0:
            return { name, icon, type: "select", ...nodeSource };
        case 1:
            return {
                name,
                icon,
                type: "url-test",
                url: SPEEDTEST_URL,
                interval: 60,
                tolerance: 20,
                ...nodeSource,
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
                ...nodeSource,
            };
    }
}

/** 构造一个手动选择的代理组。 */
export function selectGroup(
    name: string,
    icon: string,
    proxies: string[],
    includeAll = false
): SelectProxyGroup {
    return {
        name,
        icon,
        type: "select",
        ...(includeAll ? { "include-all": true as const } : {}),
        proxies,
    };
}

/** 构造一个自动测速的代理组。 */
export function urlTestGroup(name: string, icon: string, proxies: string[]): UrlTestProxyGroup {
    return {
        name,
        icon,
        type: "url-test",
        url: SPEEDTEST_URL,
        proxies,
        interval: 60,
        tolerance: 20,
    };
}

/** 构造一个故障转移的代理组。 */
export function fallbackGroup(name: string, icon: string, proxies: string[]): FallbackProxyGroup {
    return {
        name,
        icon,
        type: "fallback",
        url: SPEEDTEST_URL,
        proxies,
        interval: 60,
        tolerance: 20,
    };
}
