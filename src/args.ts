import { parseBool, parseNumber } from "./utils";
import type { FeatureFlags, GroupType, ScriptArgs } from "./types";

/**
 * 解析 grouptype 参数，支持向后兼容旧 loadbalance 参数。
 * - 优先使用 `grouptype`（0=select, 1=url-test, 2=load-balance）
 * - 若 `grouptype` 不存在但 `loadbalance` 存在：true→2, false→1
 * - 均不存在时默认为 0（select）
 * - 非法值回退为 0
 * @param args - 从外部脚本环境传入的原始参数对象
 * @returns 解析后的代理组类型：0=select, 1=url-test, 2=load-balance
 * @example
 * ```ts
 * // grouptype 优先
 * parseGroupType({ grouptype: "1" }); // => 1 (url-test)
 * // 回退到 loadbalance
 * parseGroupType({ loadbalance: "true" }); // => 2 (load-balance)
 * // 均不存在时默认 select
 * parseGroupType({}); // => 0 (select)
 * ```
 */
function parseGroupType(args: ScriptArgs): GroupType {
    const fallback: GroupType =
        args.loadbalance !== undefined ? (parseBool(args.loadbalance) ? 2 : 1) : 0;
    const raw = parseNumber(args.grouptype, fallback);
    if (raw === 0 || raw === 1 || raw === 2) return raw;
    return 0;
}

/**
 * 解析传入的脚本参数，并将其转换为内部使用的功能开关（feature flags）。
 * @param args - 从外部脚本环境（如 Substore）传入的原始参数对象
 * @returns 经过解析和类型转换后的功能开关集合 `FeatureFlags`
 */
export function buildFeatureFlags(args: ScriptArgs): FeatureFlags {
    return {
        groupType: parseGroupType(args),
        landing: parseBool(args.landing),
        ipv6Enabled: parseBool(args.ipv6),
        fullConfig: parseBool(args.full),
        keepAliveEnabled: parseBool(args.keepalive),
        fakeIPEnabled: parseBool(args.fakeip, true),
        quicEnabled: parseBool(args.quic),
        regexFilter: parseBool(args.regex),
        tunEnabled: parseBool(args.tun),
        countryThreshold: parseNumber(args.threshold, 0),
    };
}
