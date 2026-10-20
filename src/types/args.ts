/**
 * 脚本参数与功能开关相关的类型定义。
 */

/** Substore/Clash 覆写脚本从 URL hash 接收的原始字符串参数。 */
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

/** 地区代理组类型：0=select（手动选择），1=url-test（自动测速），2=load-balance（负载均衡）。 */
export type GroupType = 0 | 1 | 2;

/** 解析后的功能开关集合，下游模块无需再关心参数来源或缺失情况。 */
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
