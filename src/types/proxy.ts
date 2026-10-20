/**
 * 代理节点、代理组与节点分类结果相关的类型定义。
 */

import type { FeatureFlags } from "./args";

/** 上游订阅中的一个代理节点。除 name 外的字段均透传，故使用索引签名。 */
export interface ProxyNode {
    name: string;
    type?: string;
    server?: string;
    port?: number;
    [key: string]: unknown;
}

export type ProxyGroupType = "select" | "url-test" | "load-balance" | "fallback";

export type LoadBalanceStrategy = "sticky-sessions" | "consistent-hashing" | "round-robin";

/** 所有代理组共有的字段。 */
export interface BaseProxyGroup {
    name: string;
    icon?: string;
    proxies?: string[];
    "include-all"?: boolean;
    filter?: string;
    "exclude-filter"?: string;
}

export interface SelectProxyGroup extends BaseProxyGroup {
    type: "select";
}

export interface UrlTestProxyGroup extends BaseProxyGroup {
    type: "url-test";
    url: string;
    interval: number;
    tolerance: number;
}

export interface LoadBalanceProxyGroup extends BaseProxyGroup {
    type: "load-balance";
    url: string;
    interval: number;
    tolerance: number;
    strategy: LoadBalanceStrategy;
}

export interface FallbackProxyGroup extends BaseProxyGroup {
    type: "fallback";
    url: string;
    interval: number;
    tolerance: number;
}

export type ProxyGroup =
    SelectProxyGroup | UrlTestProxyGroup | LoadBalanceProxyGroup | FallbackProxyGroup;

/**
 * 国家/地区元数据：
 * - `pattern` 用于匹配节点名称中的地理位置关键字；
 * - `icon`、`weight` 用于代理组的展示与排序；
 * - `excludePattern` 用于排除误匹配的节点（如“美属”“法属”）。
 */
export interface CountryMeta {
    weight?: number;
    pattern: string;
    icon: string;
    excludePattern?: string;
}

/** 大小写不敏感的节点匹配器，同时保留 Clash `(?i)` 前缀的 pattern 形式。 */
export interface CaseInsensitiveNodeMatcher {
    source: string;
    regex: RegExp;
    pattern: string;
}

/** 各策略组可复用的基础代理候选列表。 */
export interface BaseLists {
    defaultProxies: string[];
    defaultProxiesDirect: string[];
    defaultSelector: string[];
    defaultFallback: string[];
    frontProxySelector: string[];
}

/** 构建基础候选列表所需输入。 */
export interface BuildBaseListsInput {
    landing: boolean;
    lowCostNodes: ProxyNode[];
    countryNames: string[];
    nonLandingNodes: ProxyNode[];
    regexFilter: boolean;
}

/** 节点经过多维度分类后的结果，是配置构建阶段的唯一节点数据来源。 */
export interface NodeAnalysis {
    /** 全部节点（原样）。 */
    allNodes: ProxyNode[];
    /** 全部节点名称。 */
    allNames: string[];
    /** 带 `dialer-proxy: "前置代理"` 的落地节点。 */
    landingNodes: ProxyNode[];
    /** 普通/中继节点。 */
    nonLandingNodes: ProxyNode[];
    /** 落地节点与非落地节点是否同时存在。 */
    landing: boolean;
    /** 地区名（不含后缀）→ 节点数组。 */
    countryNodes: Record<string, ProxyNode[]>;
    /** 通过阈值过滤并按权重排序后的地区名（不含后缀）。 */
    countryNames: string[];
    /** 匹配低倍率正则的节点。 */
    lowCostNodes: ProxyNode[];
    /** `type: "tailscale"` 的节点。 */
    tailscaleNodes: ProxyNode[];
    /** 是否存在 Tailscale 节点。 */
    hasTailscale: boolean;
}

/** 代理组构建阶段共享的上下文。 */
export interface GroupBuildContext {
    flags: FeatureFlags;
    nodes: NodeAnalysis;
    lists: BaseLists;
}
