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
 * 构造 `exclude-filter`，从 `include-all` 的动态节点中排除指定的节点名称。
 * 使用完整的锚定分组，避免节点名中的特殊字符导致误匹配。
 * @returns 无有效节点名时返回 `undefined`，表示无需排除。
 */
export function buildNodeExcludeFilter(nodes: ProxyNode[]): string | undefined {
    const names = [...new Set(nodes.map((node) => node.name).filter(Boolean))];
    if (names.length === 0) return undefined;

    return `^(?:${names.map(escapeRegExp).join("|")})$`;
}

/**
 * 合并两段 `exclude-filter`。
 * @param base - 已有过滤规则（如地区误匹配正则）
 * @param extra - 追加的过滤规则
 */
export function combineExcludeFilters(
    base: string | undefined,
    extra: string | undefined
): string | undefined {
    if (!base) return extra;
    if (!extra) return base;

    return `${base}|${extra}`;
}
