/**
 * URL 参数解析：将原始字符串参数转换为类型安全的 `FeatureFlags`。
 */

import { parseBool, parseNumber } from "../utils/primitives";
import { ARG_DEFAULTS } from "./schema";
import type { FeatureFlags, GroupType, ScriptArgs } from "../types/args";

/**
 * 解析 `grouptype` 参数，并向后兼容旧的 `loadbalance` 参数。
 * - `grouptype`：0=select，1=url-test，2=load-balance，优先级最高；
 * - 仅当 `grouptype` 未指定（或非法）时，才回退到旧参数 `loadbalance`：true→2，false→1；
 * - 两者都不可用时回退为默认值。
 */
function parseGroupType(args: ScriptArgs): GroupType {
    const raw = parseNumber(args.grouptype, Number.NaN);
    if (raw === 0 || raw === 1 || raw === 2) return raw;

    if (typeof args.loadbalance !== "undefined") {
        return parseBool(args.loadbalance) ? 2 : 1;
    }

    return ARG_DEFAULTS.groupType;
}

/**
 * 解析传入的脚本参数，并转换为内部使用的功能开关。
 * @param args - 从脚本环境（如 Substore）传入的原始参数对象
 */
export function buildFeatureFlags(args: ScriptArgs): FeatureFlags {
    return {
        groupType: parseGroupType(args),
        ipv6Enabled: parseBool(args.ipv6),
        fullConfig: parseBool(args.full),
        keepAliveEnabled: parseBool(args.keepalive),
        fakeIPEnabled: parseBool(args.fakeip, ARG_DEFAULTS.fakeIPEnabled),
        quicEnabled: parseBool(args.quic),
        regexFilter: parseBool(args.regex),
        tunEnabled: parseBool(args.tun),
        countryThreshold: parseNumber(args.threshold, ARG_DEFAULTS.countryThreshold),
    };
}
