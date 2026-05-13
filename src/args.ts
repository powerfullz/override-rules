import { parseBool, parseNumber } from "./utils";
import type { FeatureFlags, ScriptArgs } from "./types";

const FEATURE_FLAG_DEFAULTS = {
    loadBalance: false,
    landing: false,
    ipv6Enabled: false,
    fullConfig: false,
    keepAliveEnabled: false,
    fakeIPEnabled: true,
    quicEnabled: false,
    regexFilter: false,
} as const;

/**
 * 解析传入的脚本参数，并将其转换为内部使用的功能开关（feature flags）。
 * @param args - 从外部脚本环境（如 Substore）传入的原始参数对象
 * @returns 经过解析和类型转换后的功能开关集合 `FeatureFlags`
 */
export function buildFeatureFlags(args: ScriptArgs): FeatureFlags {
    const flags: FeatureFlags = {
        ...FEATURE_FLAG_DEFAULTS,
        countryThreshold: 0,
    };

    flags.loadBalance = parseBool(args.loadbalance);
    flags.landing = parseBool(args.landing);
    flags.ipv6Enabled = parseBool(args.ipv6);
    flags.fullConfig = parseBool(args.full);
    flags.keepAliveEnabled = parseBool(args.keepalive);
    flags.fakeIPEnabled =
        args.fakeip !== undefined ? parseBool(args.fakeip) : FEATURE_FLAG_DEFAULTS.fakeIPEnabled;
    flags.quicEnabled = parseBool(args.quic);
    flags.regexFilter = parseBool(args.regex);
    flags.countryThreshold = parseNumber(args.threshold, 0);

    return flags;
}
