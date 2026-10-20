/**
 * 地区活跃度判定：按最小节点数阈值过滤，并按权重排序。
 */

import { countriesMeta } from "../catalog/countries";
import type { ProxyNode } from "../types/proxy";

/**
 * 根据最小节点数量阈值过滤地区，并按权重排序后返回地区名称列表。
 * @param countryNodes - 地区名 → 节点数组 的映射
 * @param minCount - 地区节点数量的最小阈值，节点数不足该值的地区将被过滤掉
 * @returns 按权重排序的地区名数组（不含后缀）
 */
export function getActiveCountryNames(
    countryNodes: Record<string, ProxyNode[]>,
    minCount: number
): string[] {
    return Object.entries(countryNodes)
        .filter(([, nodes]) => nodes.length >= minCount)
        .sort(([a], [b]) => {
            const wa = countriesMeta[a]?.weight ?? Infinity;
            const wb = countriesMeta[b]?.weight ?? Infinity;
            return wa - wb;
        })
        .map(([country]) => country);
}
