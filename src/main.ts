/*!
powerfullz 的 Substore 订阅转换脚本
https://github.com/powerfullz/override-rules

支持的传入参数：
- grouptype: 地区代理组类型（0=select 手动选择, 1=url-test 自动测速, 2=load-balance 负载均衡，默认 0）
  - 向后兼容：若未传 grouptype 但传了 loadbalance，则 loadbalance=true 映射为 grouptype=2，loadbalance=false 映射为 grouptype=1
- landing: auto-detected from nodes with `dialer-proxy` field; no user parameter needed
- ipv6: 启用 IPv6 支持（默认 false）
- tun: 启用 TUN 模式（默认 false）
- full: 输出完整配置（适合纯内核启动，默认 false）
- keepalive: 启用 tcp-keep-alive（默认 false）
- fakeip: DNS 使用 FakeIP 模式（默认 true；传 false 时为 RedirHost）
- quic: 允许 QUIC 流量（UDP 443，默认 false）
- threshold: 地区节点数量小于该值时不显示分组 (默认 0)
- regex: 使用正则过滤模式（include-all + filter）写入各地区代理组，而非直接枚举节点名称（默认 false）

源码已迁移至 `src/*.ts`。
*/

import { CDN_URL, PROXY_GROUPS } from "./constants";
import { buildFeatureFlags } from "./args";
import { buildProxyGroups } from "./proxy_groups";
import {
    getActiveCountryNames,
    parseCountries,
    parseLowCost,
    parseNodesByLanding,
} from "./node_parser";
import { buildRules } from "./rules";
import { ruleProviders } from "./rule_providers";
import { buildDns, snifferConfig } from "./dns";
import { buildTunConfig } from "./tun";
import { buildBaseLists } from "./selectors";
import type { ClashConfig, ScriptArgs } from "./types";

const geoxURL = {
    geoip: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/geoip.dat`,
    geosite: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/geosite.dat`,
    mmdb: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/country.mmdb`,
    asn: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/GeoLite2-ASN.mmdb`,
};

declare const $arguments: ScriptArgs;

function getRawArgs(): ScriptArgs {
    try {
        return $arguments;
    } catch {
        // console.log("[powerfullz 的覆写脚本] 未检测到传入参数，使用默认参数。");
        return {};
    }
}

const rawArgs = getRawArgs();
const {
    groupType,
    ipv6Enabled,
    fullConfig,
    keepAliveEnabled,
    fakeIPEnabled,
    quicEnabled,
    regexFilter,
    tunEnabled,
    countryThreshold,
} = buildFeatureFlags(rawArgs);

function main(config: ClashConfig): ClashConfig {
    if (!config.proxies || !Array.isArray(config.proxies)) {
        throw new Error("[powerfullz 的覆写脚本] 错误：Clash 配置中缺少有效的 proxies 字段");
    }
    const { landingNodes, nonLandingNodes } = parseNodesByLanding(config.proxies);
    const landing = landingNodes.length > 0 && nonLandingNodes.length > 0;
    const countryNodes = parseCountries(landing ? nonLandingNodes : config.proxies);
    const lowCostNodes = parseLowCost(landing ? nonLandingNodes : config.proxies);
    const countryNames = getActiveCountryNames(countryNodes, countryThreshold);

    const {
        defaultProxies,
        defaultProxiesDirect,
        defaultSelector,
        defaultFallback,
        frontProxySelector,
    } = buildBaseLists({
        landing,
        lowCostNodes,
        countryNames,
        nonLandingNodes,
        regexFilter,
    });

    const proxyGroups = buildProxyGroups({
        regexFilter,
        groupType,
        countryNames,
        countryNodes,
        lowCostNodes,
        landing,
        landingNodes,
        defaultProxies,
        defaultProxiesDirect,
        defaultSelector,
        defaultFallback,
        frontProxySelector,
    });

    const globalProxies = proxyGroups.map((item) => String(item.name));
    proxyGroups.push({
        name: PROXY_GROUPS.GLOBAL,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Global.png`,
        "include-all": true,
        type: "select",
        proxies: globalProxies,
    });

    const finalRules = buildRules({ quicEnabled });

    return {
        proxies: config.proxies,
        ...(fullConfig && {
            "mixed-port": 7890,
            "redir-port": 7892,
            "tproxy-port": 7893,
            "routing-mark": 7894,
            "allow-lan": true,
            "bind-address": "*",
            ipv6: ipv6Enabled,
            mode: "rule",
            "unified-delay": true,
            "tcp-concurrent": true,
            "find-process-mode": "off",
            "log-level": "info",
            "geodata-loader": "standard",
            "external-controller": ":9999",
            "disable-keep-alive": !keepAliveEnabled,
            profile: { "store-selected": true },
        }),
        "proxy-groups": proxyGroups,
        "rule-providers": ruleProviders,
        rules: finalRules,
        sniffer: snifferConfig,
        dns: buildDns({ fakeIPEnabled, ipv6Enabled }),
        tun: buildTunConfig(tunEnabled),
        "geodata-mode": true,
        "geox-url": geoxURL,
    };
}

(globalThis as Record<string, unknown>).main = main;
