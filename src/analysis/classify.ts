/**
 * 节点多维度分类。
 *
 * 将上游订阅的原始节点列表一次性归类为：落地/非落地、国家/地区、低倍率、Tailscale，
 * 作为配置构建阶段唯一的数据来源。
 */

import { countryExcludeRegexMap, countryRegexMap } from "../catalog/countries";
import { PROXY_GROUPS } from "../catalog/group-names";
import { LOW_COST_NODE_MATCHER } from "../catalog/low-cost";
import { getActiveCountryNames } from "./active-countries";
import type { NodeAnalysis, ProxyNode } from "../types/proxy";

/**
 * 按 `dialer-proxy` 字段将节点分为落地节点与非落地节点。
 *
 * 在 Clash 链式代理中，`dialer-proxy` 表示当前节点通过指定代理拨号，
 * 因此带 `dialer-proxy: "前置代理"` 的节点是落地节点（目标节点），其余为非落地节点。
 */
function splitByLanding(nodes: ProxyNode[]): {
    landingNodes: ProxyNode[];
    nonLandingNodes: ProxyNode[];
} {
    const landingNodes: ProxyNode[] = [];
    const nonLandingNodes: ProxyNode[] = [];

    for (const node of nodes) {
        if (!node.name) continue;

        if (node["dialer-proxy"] === PROXY_GROUPS.FRONT_PROXY) {
            landingNodes.push(node);
        } else {
            nonLandingNodes.push(node);
        }
    }

    return { landingNodes, nonLandingNodes };
}

/**
 * 按 `countriesMeta` 中定义的地区归类节点，命中首个地区即停止，并排除误匹配。
 */
function collectCountries(nodes: ProxyNode[]): Record<string, ProxyNode[]> {
    const countryNodes: Record<string, ProxyNode[]> = Object.create(null);

    for (const node of nodes) {
        const name = node.name || "";

        for (const [country, regex] of Object.entries(countryRegexMap)) {
            if (!regex.test(name)) continue;
            if (countryExcludeRegexMap[country]?.test(name)) continue;

            (countryNodes[country] ??= []).push(node);
            break;
        }
    }

    return countryNodes;
}

/** 筛选出所有匹配低倍率正则的节点。 */
function collectLowCost(nodes: ProxyNode[]): ProxyNode[] {
    return nodes.filter((node) => LOW_COST_NODE_MATCHER.regex.test(node.name || ""));
}

/** 筛选出所有 Tailscale 节点。 */
function collectTailscale(nodes: ProxyNode[]): ProxyNode[] {
    return nodes.filter((node) => node.type === "tailscale");
}

/**
 * 对节点列表执行全部分类。
 * @param nodes - 上游订阅的节点列表（`config.proxies`）
 * @param threshold - 地区节点数量的最小阈值
 */
export function analyzeNodes(nodes: ProxyNode[], threshold: number): NodeAnalysis {
    const { landingNodes, nonLandingNodes } = splitByLanding(nodes);
    const landing = landingNodes.length > 0 && nonLandingNodes.length > 0;

    // 链式代理激活时，国家/低倍率分类只扫描非落地节点。
    const scopedNodes = landing ? nonLandingNodes : nodes;
    const countryNodes = collectCountries(scopedNodes);
    const countryNames = getActiveCountryNames(countryNodes, threshold);
    const lowCostNodes = collectLowCost(scopedNodes);
    const tailscaleNodes = collectTailscale(nodes);

    return {
        allNodes: nodes,
        allNames: nodes.map((node) => node.name),
        landingNodes,
        nonLandingNodes,
        landing,
        countryNodes,
        countryNames,
        lowCostNodes,
        tailscaleNodes,
        hasTailscale: tailscaleNodes.length > 0,
    };
}
