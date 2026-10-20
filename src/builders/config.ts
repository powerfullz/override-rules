/**
 * 最终配置组装：将节点、代理组、规则、DNS、TUN、Geo 数据源及上游字段拼装为最终 `ClashConfig`。
 */

import { PROXY_GROUPS } from "../catalog/group-names";
import { ICONS } from "../catalog/icons";
import { ruleSets } from "../catalog/rule-sets";
import { buildDns } from "./dns";
import { buildFullConfig } from "./full-config";
import { geoxUrl } from "./geox";
import { buildRules } from "./rules";
import { snifferConfig } from "./sniffer";
import { buildTunConfig } from "./tun";
import type { FeatureFlags } from "../types/args";
import type { ClashConfig } from "../types/clash";
import type { NodeAnalysis, ProxyGroup } from "../types/proxy";

/**
 * 追加 GLOBAL 代理组：其候选为它之前的所有代理组。
 */
function appendGlobalGroup(groups: ProxyGroup[]): ProxyGroup[] {
    const global: ProxyGroup = {
        name: PROXY_GROUPS.GLOBAL,
        icon: ICONS.global,
        "include-all": true,
        type: "select",
        proxies: groups.map((group) => String(group.name)),
    };

    return [...groups, global];
}

/** 组装最终配置所需的上下文数据。 */
export interface AssembleConfigInput {
    flags: FeatureFlags;
    nodes: NodeAnalysis;
    proxyGroups: ProxyGroup[];
}

/**
 * 将各部分拼装为最终配置。
 *
 * 上游 `hosts` 始终保留；`full=true` 时追加完整内核参数；
 * DNS 会按字段规则继承上游配置。
 * @param config - 上游订阅配置
 * @param input - 组装上下文
 */
export function assembleConfig(
    config: ClashConfig,
    { flags, nodes, proxyGroups }: AssembleConfigInput
): ClashConfig {
    return {
        proxies: config.proxies,
        ...(config.hosts !== undefined && { hosts: config.hosts }),
        ...(flags.fullConfig && buildFullConfig(flags)),
        "proxy-groups": appendGlobalGroup(proxyGroups),
        "rule-providers": ruleSets,
        rules: buildRules({ quicEnabled: flags.quicEnabled, hasTailscale: nodes.hasTailscale }),
        sniffer: snifferConfig,
        dns: buildDns({
            fakeIPEnabled: flags.fakeIPEnabled,
            ipv6Enabled: flags.ipv6Enabled,
            upstreamDns: config.dns,
        }),
        tun: buildTunConfig(flags.tunEnabled, nodes.hasTailscale),
        "geodata-mode": true,
        "geox-url": geoxUrl,
    };
}
