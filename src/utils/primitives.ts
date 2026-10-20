/**
 * 通用基础工具函数。
 */

/**
 * 解析布尔值，支持 boolean、`"true"` 与 `"1"`。
 * @param value - 待解析的原始值
 * @param defaultValue - 当 `value` 为 `undefined` 时的回退值，默认为 `false`
 */
export function parseBool(value: unknown, defaultValue = false): boolean {
    if (typeof value === "undefined") return defaultValue;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
        return value.toLowerCase() === "true" || value === "1";
    }
    return false;
}

/**
 * 将任意值解析为整数。
 * @param value - 待解析的原始值
 * @param defaultValue - 解析失败时的回退值，默认为 `0`
 */
export function parseNumber(value: unknown, defaultValue = 0): number {
    if (value === null || typeof value === "undefined") {
        return defaultValue;
    }

    const num = parseInt(String(value), 10);
    return Number.isNaN(num) ? defaultValue : num;
}

/**
 * 接受任意数量的元素（包括嵌套数组），展平后过滤掉所有假值（false、null、undefined 等）。
 * @param elements - 任意数量的元素或元素数组，允许混入假值
 */
export function buildList<T>(...elements: Array<T | T[] | false | null | undefined>): T[] {
    return elements.flat().filter(Boolean) as T[];
}

/**
 * 类型谓词：过滤掉 null 值。
 * @param value - 待检查的值
 */
export function isNotNull<T>(value: T | null): value is T {
    return value !== null;
}
