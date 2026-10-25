/*!
powerfullz 的 Substore 订阅转换脚本
https://github.com/powerfullz/override-rules

支持的传入参数：
- grouptype: 地区代理组类型（0=select 手动选择, 1=url-test 自动测速, 2=load-balance 负载均衡，默认 1）
  - 向后兼容：若未传 grouptype 但传了 loadbalance，则 loadbalance=true 映射为 grouptype=2，loadbalance=false 映射为 grouptype=1
- landing: 自动检测带 `dialer-proxy` 字段的节点，无需用户传参
- ipv6: 启用 IPv6 支持（默认 false）
- tun: 启用 TUN 模式（默认 false）
- full: 输出完整配置（适合纯内核启动，默认 false）
- keepalive: 启用 tcp-keep-alive（默认 false）
- fakeip: DNS 使用 FakeIP 模式（默认 true；传 false 时为 RedirHost）
- quic: 允许 QUIC 流量（UDP 443，默认 false）
- threshold: 地区节点数量小于该值时不显示分组（默认 2）
- regex: 使用正则过滤模式（include-all + filter）写入各地区代理组，而非直接枚举节点名称（默认 false）

源码位于 `src/`，入口为 `src/main.ts`。
*/

import { buildFeatureFlags } from "./args/parse";
import { analyzeNodes } from "./analysis/classify";
import { buildBaseLists } from "./builders/selectors";
import { assembleConfig } from "./builders/config";
import { buildProxyGroups } from "./builders/proxy-groups";
import type { ScriptArgs } from "./types/args";
import type { ClashConfig } from "./types/clash";

declare const $arguments: ScriptArgs;

/** 读取脚本环境传入的参数；未检测到时返回空对象以使用默认值。 */
function readRawArgs(): ScriptArgs {
    try {
        return $arguments;
    } catch {
        return {};
    }
}

/**
 * 覆写脚本入口。
 *
 * 流程：解析参数 → 节点分类 → 构建候选列表 → 构建代理组 → 组装最终配置。
 * @param config - 上游订阅配置
 */
function main(config: ClashConfig): ClashConfig {
    if (!config.proxies || !Array.isArray(config.proxies)) {
        throw new Error("[powerfullz 的覆写脚本] 错误：Clash 配置中缺少有效的 proxies 字段");
    }

    const flags = buildFeatureFlags(readRawArgs());
    const nodes = analyzeNodes(config.proxies, flags.countryThreshold);
    const lists = buildBaseLists({
        landing: nodes.landing,
        landingNodes: nodes.landingNodes,
        lowCostNodes: nodes.lowCostNodes,
        nonLandingNodes: nodes.nonLandingNodes,
        tailscaleNodes: nodes.tailscaleNodes,
        regexFilter: flags.regexFilter,
        regions: nodes.regionLayout,
    });
    const proxyGroups = buildProxyGroups({ flags, nodes, lists });

    return assembleConfig(config, { flags, nodes, proxyGroups });
}

(globalThis as Record<string, unknown>).main = main;
