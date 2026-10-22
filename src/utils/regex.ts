/**
 * 正则匹配相关的工具函数。
 */

import type { CaseInsensitiveNodeMatcher, ProxyNode } from "../types/proxy";

/** 正则表达式中需要转义的元字符。 */
const REGEXP_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;

/**
 * 根据给定的正则源字符串，创建一个大小写不敏感的节点匹配器对象。
 * @param source - 正则表达式源字符串（不含修饰符）
 * @returns 包含原始字符串、编译后的 RegExp 对象以及 Clash `(?i)` 前缀 pattern 的匹配器对象
 */
export function createCaseInsensitiveNodeMatcher(source: string): CaseInsensitiveNodeMatcher {
    return {
        source,
        regex: new RegExp(source, "i"),
        pattern: `(?i)${source}`,
    };
}

/** 转义节点名称中的正则元字符，使其只按字面量匹配。 */
function escapeRegExp(value: string): string {
    return value.replace(REGEXP_SPECIAL_CHARS, "\\$&");
}

/**
 * 构造 `exclude-filter`，从 `include-all` 的动态节点中排除全部落地节点。
 * 使用完整的锚定分组，避免节点名中的特殊字符导致误匹配。
 */
export function buildLandingExcludeFilter(landingNodes: ProxyNode[]): string {
    const names = landingNodes.map((node) => node.name).filter(Boolean);
    return `^(?:${names.map(escapeRegExp).join("|")})$`;
}
