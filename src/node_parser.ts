import { LOW_COST_NODE_MATCHER, countriesMeta } from "./constants";
import type { ProxyNode } from "./types";

const COUNTRY_REGEX_MAP = Object.fromEntries(
    Object.entries(countriesMeta).map(([country, meta]) => {
        return [country, new RegExp(meta.pattern.replace(/^\(\?i\)/, ""))];
    })
) as Record<string, RegExp>;

const COUNTRY_EXCLUDE_MAP = Object.fromEntries(
    Object.entries(countriesMeta)
        .filter(([, meta]) => meta.excludePattern)
        .map(([country, meta]) => [country, new RegExp(meta.excludePattern!)])
) as Record<string, RegExp>;

/**
 * 从 Clash 配置中筛选出所有低价节点的名称。
 * @param config - 当前的 Clash 配置对象，需包含 `proxies` 字段
 * @returns 匹配低价节点正则的节点数组
 */
export function parseLowCost(nodes: ProxyNode[]): ProxyNode[] {
    return (nodes || []).filter((proxy) => LOW_COST_NODE_MATCHER.regex.test(proxy.name || ""));
}

/**
 * 根据 dialer-proxy 字段将节点分为落地节点和非落地节点。
 * 在 Mihomo 链式代理中，`dialer-proxy` 表示当前节点通过指定代理拨号。
 * 因此带 `dialer-proxy: "前置代理"` 的节点是落地节点（目标节点），其余为非落地节点。
 * @param nodes - 节点数组，一般是 `config.proxies` 列表
 * @returns 包含 `landingNodes`（带 dialer-proxy 的落地节点）和 `nonLandingNodes`（普通/中继节点）
 */
export function parseNodesByLanding(nodes: ProxyNode[]): {
    landingNodes: ProxyNode[];
    nonLandingNodes: ProxyNode[];
} {
    const landingNodes: ProxyNode[] = [];
    const nonLandingNodes: ProxyNode[] = [];

    for (const node of nodes || []) {
        const name = node.name;

        if (!name) continue;

        if (node["dialer-proxy"] === "前置代理") {
            landingNodes.push(node);
        } else {
            nonLandingNodes.push(node);
        }
    }

    return { landingNodes, nonLandingNodes };
}

/**
 * 遍历订阅中的所有节点，按 `countriesMeta` 中定义的地区进行归类。
 * 排除匹配 COUNTRY_EXCLUDE_MAP[country] 的节点。
 * @param nodes - 节点数组，当链式代理激活时为 nonLandingNodes，否则为全部节点
 * @returns 地区名到节点数组的映射 Record
 */
export function parseCountries(nodes: ProxyNode[]): Record<string, ProxyNode[]> {
    const countryNodes: Record<string, ProxyNode[]> = Object.create(null);

    for (const node of nodes) {
        const name = node.name || "";

        for (const [country, regex] of Object.entries(COUNTRY_REGEX_MAP)) {
            if (!regex.test(name)) continue;
            if (COUNTRY_EXCLUDE_MAP[country]?.test(name)) continue;

            if (!countryNodes[country]) {
                countryNodes[country] = [];
            }
            countryNodes[country].push(node);
            break;
        }
    }

    return countryNodes;
}

/**
 * 根据最小节点数量阈值过滤地区，并按权重排序后返回地区名称列表。
 * @param countryNodes - 由 `parseCountries` 返回的地区名到节点数组的映射
 * @param minCount - 地区节点数量的最小阈值，节点数不足该值的地区将被过滤掉
 * @returns 按权重排序的地区名数组（不含后缀）
 */
export function getActiveCountryNames(
    countryNodes: Record<string, ProxyNode[]>,
    minCount: number
): string[] {
    const filtered = Object.entries(countryNodes).filter(([, nodes]) => nodes.length >= minCount);

    filtered.sort(([a], [b]) => {
        const wa = countriesMeta[a]?.weight ?? Infinity;
        const wb = countriesMeta[b]?.weight ?? Infinity;
        return wa - wb;
    });

    return filtered.map(([country]) => country);
}
