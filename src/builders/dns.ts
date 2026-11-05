/**
 * DNS 配置构建：生成脚本控制的核心设置，并按字段规则继承上游配置。
 */

import { DEFAULT_FALLBACK_DNS, DEFAULT_NAMESERVERS, FAKE_IP_FILTER } from "../catalog/dns";
import type { DnsConfig, DnsPolicyValue } from "../types/clash";

/** 可继承的上游 DNS Policy 字段。 */
const POLICY_FIELDS = ["nameserver-policy", "proxy-server-nameserver-policy"] as const;

/** 可继承的上游 DNS 字符串列表字段。 */
const LIST_FIELDS = ["proxy-server-nameserver", "fake-ip-filter"] as const;

/** 可继承的上游 DNS 标量字段。 */
const SCALAR_FIELDS = ["listen"] as const;

type PolicyField = (typeof POLICY_FIELDS)[number];
type ListField = (typeof LIST_FIELDS)[number];
type ScalarField = (typeof SCALAR_FIELDS)[number];

/** 判断值是否为非数组对象。 */
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** 读取仅包含字符串的数组，拒绝格式错误的上游字段。 */
function toStringList(value: unknown): string[] | undefined {
    return Array.isArray(value) && value.every((item) => typeof item === "string")
        ? (value as string[])
        : undefined;
}

/** 合并两个字符串列表并移除重复值，保留当前配置的优先顺序。 */
function mergeStringList(
    current: readonly string[] | undefined,
    upstream: unknown
): string[] | undefined {
    const upstreamList = toStringList(upstream);
    if (!current && !upstreamList) return undefined;

    return [...new Set([...(current ?? []), ...(upstreamList ?? [])])];
}

/** 合并 DNS Policy，仅保留 Clash 支持的字符串或字符串数组值。 */
function mergePolicyMap(
    current: Record<string, DnsPolicyValue> | undefined,
    upstream: unknown
): Record<string, DnsPolicyValue> | undefined {
    if (!isRecord(upstream)) return current;

    const inherited: Record<string, DnsPolicyValue> = {};
    for (const [domain, value] of Object.entries(upstream)) {
        if (typeof value === "string") {
            inherited[domain] = value;
        } else if (toStringList(value)) {
            inherited[domain] = value as string[];
        }
    }

    return { ...(current ?? {}), ...inherited };
}

/** 合并所有可继承的 Policy 字段。 */
function inheritPolicyFields(
    generated: DnsConfig,
    upstream: Partial<DnsConfig>
): Partial<Record<PolicyField, Record<string, DnsPolicyValue>>> {
    const inherited: Partial<Record<PolicyField, Record<string, DnsPolicyValue>>> = {};

    for (const field of POLICY_FIELDS) {
        const merged = mergePolicyMap(generated[field], upstream[field]);
        if (merged !== undefined) inherited[field] = merged;
    }

    return inherited;
}

/** 继承上游的标量字段；当前配置已设置时保持优先。 */
function inheritScalarFields(
    generated: DnsConfig,
    upstream: Partial<DnsConfig>
): Partial<Record<ScalarField, string>> {
    const inherited: Partial<Record<ScalarField, string>> = {};

    for (const field of SCALAR_FIELDS) {
        const current = generated[field];
        const value = upstream[field];
        if (current === undefined && typeof value === "string" && value.length > 0) {
            inherited[field] = value;
        }
    }

    return inherited;
}

/** 合并所有可继承的字符串列表字段。 */
function inheritListFields(
    generated: DnsConfig,
    upstream: Partial<DnsConfig>
): Partial<Record<ListField, string[]>> {
    const inherited: Partial<Record<ListField, string[]>> = {};

    for (const field of LIST_FIELDS) {
        const merged = mergeStringList(generated[field], upstream[field]);
        if (merged !== undefined) inherited[field] = merged;
    }

    return inherited;
}

/** 合并上游允许继承的字段；脚本生成的核心字段始终优先。 */
function inheritDnsFields(generated: DnsConfig, upstream?: Partial<DnsConfig>): DnsConfig {
    if (!isRecord(upstream)) return generated;

    return {
        ...generated,
        ...inheritPolicyFields(generated, upstream),
        ...inheritListFields(generated, upstream),
        ...inheritScalarFields(generated, upstream),
    };
}

/** 生成脚本控制的核心 DNS 设置。 */
function createBaseDnsConfig(mode: DnsConfig["enhanced-mode"], ipv6Enabled: boolean): DnsConfig {
    return {
        enable: true,
        ipv6: ipv6Enabled,
        "prefer-h3": true,
        "enhanced-mode": mode,
        nameserver: [...DEFAULT_NAMESERVERS],
        fallback: [...DEFAULT_FALLBACK_DNS],
        ...(mode === "fake-ip" && { "fake-ip-filter": [...FAKE_IP_FILTER] }),
    };
}

/** 构建 DNS 配置的输入参数。 */
export interface BuildDnsInput {
    fakeIPEnabled: boolean;
    ipv6Enabled: boolean;
    /** 上游订阅提供的 DNS 配置，将按字段规则继承或融合。 */
    upstreamDns?: Partial<DnsConfig>;
}

/**
 * 根据 fakeIP 与 IPv6 开关生成最终 DNS 配置，并合并上游允许继承的字段。
 * @param input - 详见 `BuildDnsInput`
 */
export function buildDns({ fakeIPEnabled, ipv6Enabled, upstreamDns }: BuildDnsInput): DnsConfig {
    const generated = createBaseDnsConfig(fakeIPEnabled ? "fake-ip" : "redir-host", ipv6Enabled);

    return inheritDnsFields(generated, upstreamDns);
}
