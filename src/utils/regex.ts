/**
 * 正则匹配相关的工具函数。
 */

import type { CaseInsensitiveNodeMatcher } from "../types/proxy";

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
