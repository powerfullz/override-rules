export interface ScriptArgs {
    grouptype?: string;
    loadbalance?: string;
    ipv6?: string;
    full?: string;
    keepalive?: string;
    fakeip?: string;
    quic?: string;
    regex?: string;
    threshold?: string;
    tun?: string;
}

export type GroupType = 0 | 1 | 2;

export interface FeatureFlags {
    groupType: GroupType;
    ipv6Enabled: boolean;
    fullConfig: boolean;
    keepAliveEnabled: boolean;
    fakeIPEnabled: boolean;
    quicEnabled: boolean;
    regexFilter: boolean;
    countryThreshold: number;
    tunEnabled: boolean;
}

export interface ProxyNode {
    name: string;
    type?: string;
    server?: string;
    port?: number;
    [key: string]: unknown;
}

export type ProxyGroupType = "select" | "url-test" | "load-balance" | "fallback";

export type LoadBalanceStrategy = "sticky-sessions" | "consistent-hashing" | "round-robin";

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

export interface SnifferProtocolConfig {
    ports: number[];
}

export interface SnifferConfig {
    sniff: {
        TLS?: SnifferProtocolConfig;
        HTTP?: SnifferProtocolConfig;
        QUIC?: SnifferProtocolConfig;
    };
    "override-destination": boolean;
    enable: boolean;
    "force-dns-mapping": boolean;
    "skip-domain": string[];
}

export interface TunConfig {
    enable: boolean;
    stack: "gvisor" | "system" | "mixed";
    device: string;
    "route-exclude-address": string[];
    "dns-hijack": string[];
    mtu: number;
}

export interface DnsConfig {
    enable: boolean;
    ipv6: boolean;
    "prefer-h3": boolean;
    "enhanced-mode": "redir-host" | "fake-ip";
    listen?: string;
    "cache-algorithm"?: "lru" | "arc";
    "use-hosts"?: boolean;
    "use-system-hosts"?: boolean;
    "respect-rules"?: boolean;
    "fake-ip-range"?: string;
    "fake-ip-range6"?: string;
    "fake-ip-filter-mode"?: "blacklist" | "whitelist" | "rule";
    "default-nameserver"?: string[];
    nameserver: string[];
    fallback: string[];
    "proxy-server-nameserver"?: string[];
    "direct-nameserver"?: string[];
    "nameserver-policy"?: Record<string, DnsPolicyValue>;
    "proxy-server-nameserver-policy"?: Record<string, DnsPolicyValue>;
    "direct-nameserver-follow-policy"?: boolean;
    "fallback-filter"?: Record<string, unknown>;
    "fake-ip-filter"?: string[];
}

/** Mihomo DNS Policy 支持的值类型。 */
export type DnsPolicyValue = string | string[];

export type RuleProviderType = "http" | "file";
export type RuleProviderBehavior = "domain" | "classical" | "ipcidr";
export type RuleProviderFormat = "mrs" | "text" | "yaml";

export interface RuleProvider {
    type: RuleProviderType;
    behavior: RuleProviderBehavior;
    format: RuleProviderFormat;
    interval: number;
    url: string;
    path: string;
}

export interface GeoxUrl {
    geoip?: string;
    geosite?: string;
    mmdb?: string;
    asn?: string;
}

export interface ClashProfile {
    "store-selected"?: boolean;
    "store-fake-ip"?: boolean;
}

export interface ClashConfig {
    proxies?: ProxyNode[];
    /** Mihomo 根级 hosts 映射。 */
    hosts?: Record<string, string | string[]>;
    "proxy-groups"?: ProxyGroup[];
    rules?: string[];
    "rule-providers"?: Record<string, RuleProvider>;
    dns?: DnsConfig;
    sniffer?: SnifferConfig;
    tun?: TunConfig;
    "geodata-mode"?: boolean;
    "geox-url"?: GeoxUrl;
    "mixed-port"?: number;
    "redir-port"?: number;
    "tproxy-port"?: number;
    "routing-mark"?: number;
    "allow-lan"?: boolean;
    "bind-address"?: string;
    ipv6?: boolean;
    mode?: "rule" | "global" | "direct";
    "unified-delay"?: boolean;
    "tcp-concurrent"?: boolean;
    "find-process-mode"?: "off" | "strict" | "always";
    "log-level"?: "info" | "warning" | "error" | "debug" | "silent";
    "geodata-loader"?: "standard" | "memconservative";
    "external-controller"?: string;
    "disable-keep-alive"?: boolean;
    profile?: ClashProfile;
}

export interface CountryMeta {
    weight?: number;
    pattern: string;
    icon: string;
    excludePattern?: string;
}

export interface CaseInsensitiveNodeMatcher {
    source: string;
    regex: RegExp;
    pattern: string;
}

export interface BaseLists {
    defaultProxies: string[];
    defaultProxiesDirect: string[];
    defaultSelector: string[];
    defaultFallback: string[];
    frontProxySelector: string[];
}

export interface BuildBaseListsInput {
    landing: boolean;
    lowCostNodes: ProxyNode[];
    countryNames: string[];
    nonLandingNodes: ProxyNode[];
    regexFilter: boolean;
}

export interface BuildProxyGroupsInput {
    allNodes: string[];
    regexFilter: boolean;
    groupType: GroupType;
    countryNames: string[];
    countryNodes: Record<string, ProxyNode[]>;
    lowCostNodes: ProxyNode[];
    landing: boolean;
    landingNodes: ProxyNode[];
    tailscaleNodes: ProxyNode[];
    defaultProxies: string[];
    defaultProxiesDirect: string[];
    defaultSelector: string[];
    defaultFallback: string[];
    frontProxySelector: string[];
}
