import { parseBool, parseNumber } from "./utils";
import type { FeatureFlags, ScriptArgs } from "./types";

/**
 * 解析传入的脚本参数，并将其转换为内部使用的功能开关（feature flags）。
 * @param args - 从外部脚本环境（如 Substore）传入的原始参数对象
 * @returns 经过解析和类型转换后的功能开关集合 `FeatureFlags`
 */
export function buildFeatureFlags(args: ScriptArgs): FeatureFlags {
    return {
        loadBalance: parseBool(args.loadbalance),
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
