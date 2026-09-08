import type { DnsConfig, DnsPolicyValue, SnifferConfig } from "./types";

/**
 * 默认的 fake-ip 过滤域名列表。
 * 这些域名不会被 fake-ip 机制代理。
 */
const FAKE_IP_FILTER = [
    "geosite:connectivity-check",
    "Mijia Cloud",
    "dig.io.mi.com",
    "localhost.ptlogin2.qq.com",
    "*.icloud.com",
    "*.stun.*.*",
    "*.stun.*.*.*",
    "*.lan",
    "*.localdomain",
    "*.example",
    "*.invalid",
    "*.localhost",
    "*.test",
    "*.local",
    "*.home.arpa",
    "time.*.com",
    "time.*.gov",
    "time.*.edu.cn",
    "time.*.apple.com",
    "time1.*.com",
    "time2.*.com",
    "time3.*.com",
    "time4.*.com",
    "time5.*.com",
    "time6.*.com",
    "time7.*.com",
    "ntp.*.com",
    "ntp1.*.com",
    "ntp2.*.com",
    "ntp3.*.com",
    "ntp4.*.com",
    "ntp5.*.com",
    "ntp6.*.com",
    "ntp7.*.com",
    "*.time.edu.cn",
    "*.ntp.org.cn",
    "+.pool.ntp.org",
    "time1.cloud.tencent.com",
    "stun.*.*",
    "stun.*.*.*",
    "swscan.apple.com",
    "mesu.apple.com",
    "music.163.com",
    "*.music.163.com",
    "*.126.net",
    "musicapi.taihe.com",
    "music.taihe.com",
    "songsearch.kugou.com",
    "trackercdn.kugou.com",
    "*.kuwo.cn",
    "api-jooxtt.sanook.com",
    "api.joox.com",
    "y.qq.com",
    "*.y.qq.com",
    "streamoc.music.tc.qq.com",
    "mobileoc.music.tc.qq.com",
    "isure.stream.qqmusic.qq.com",
    "dl.stream.qqmusic.qq.com",
    "aqqmusic.tc.qq.com",
    "amobile.music.tc.qq.com",
    "localhost.ptlogin2.qq.com",
    "*.msftconnecttest.com",
    "*.msftncsi.com",
    "*.xiami.com",
    "*.music.migu.cn",
    "music.migu.cn",
    "+.wotgame.cn",
    "+.wggames.cn",
    "+.wowsgame.cn",
    "+.wargaming.net",
    "*.*.*.srv.nintendo.net",
    "*.*.stun.playstation.net",
    "xbox.*.*.microsoft.com",
    "*.*.xboxlive.com",
    "*.ipv6.microsoft.com",
    "teredo.*.*.*",
    "teredo.*.*",
    "speedtest.cros.wr.pvp.net",
    "+.jjvip8.com",
    "www.douyu.com",
    "activityapi.huya.com",
    "activityapi.huya.com.w.cdngslb.com",
    "www.bilibili.com",
    "api.bilibili.com",
    "a.w.bilicdn1.com",
    "+.apt-agent.com",
];

/**
 * 嗅探器配置。
 */
export const snifferConfig: SnifferConfig = {
    sniff: {
        TLS: {
            ports: [443, 8443],
        },
        HTTP: {
            ports: [80, 8080, 8880],
        },
        QUIC: {
            ports: [443, 8443],
        },
    },
    "override-destination": false,
    enable: true,
    "force-dns-mapping": true,
    "skip-domain": ["Mijia Cloud", "dlg.io.mi.com", "+.push.apple.com"],
};

/**
 * 构建 DNS 配置的输入参数类型。
 */
interface BuildDnsConfigInput {
    mode: "redir-host" | "fake-ip";
    ipv6Enabled: boolean;
    fakeIpFilter?: string[];
}

/** 支持从上游配置继承的 DNS Policy 字段。 */
const DNS_POLICY_FIELDS = ["nameserver-policy", "proxy-server-nameserver-policy"] as const;

/** 判断值是否为非数组对象。 */
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** 读取仅包含字符串的数组，过滤格式错误的上游字段。 */
function getStringList(value: unknown): string[] | undefined {
    return Array.isArray(value) && value.every((item) => typeof item === "string")
        ? value
        : undefined;
}

/** 合并两个字符串列表并移除重复值，保留当前配置的优先顺序。 */
function mergeStringLists(current: string[] | undefined, upstream: unknown): string[] | undefined {
    const upstreamList = getStringList(upstream);
    if (!current && !upstreamList) return undefined;

    return [...new Set([...(current ?? []), ...(upstreamList ?? [])])];
}

/** 合并 DNS Policy，仅保留 Mihomo 支持的字符串或字符串数组值。 */
function mergeDnsPolicies(
    current: Record<string, DnsPolicyValue> | undefined,
    upstream: unknown
): Record<string, DnsPolicyValue> | undefined {
    if (!isRecord(upstream)) return current;

    const upstreamPolicy: Record<string, DnsPolicyValue> = {};
    for (const [key, value] of Object.entries(upstream)) {
        if (typeof value === "string") {
            upstreamPolicy[key] = value;
        } else if (getStringList(value)) {
            upstreamPolicy[key] = value as string[];
        }
    }

    return { ...(current ?? {}), ...upstreamPolicy };
}

/** 仅合并允许继承的上游 DNS 字段，同时保留脚本控制字段的优先级。 */
function inheritDnsFields(generated: DnsConfig, upstream?: DnsConfig): DnsConfig {
    if (!isRecord(upstream)) return generated;

    const merged = { ...generated };

    for (const field of DNS_POLICY_FIELDS) {
        const policy = mergeDnsPolicies(merged[field], upstream[field]);
        if (policy) merged[field] = policy;
    }

    const fakeIpFilter = mergeStringLists(merged["fake-ip-filter"], upstream["fake-ip-filter"]);
    if (fakeIpFilter) merged["fake-ip-filter"] = fakeIpFilter;

    return merged;
}

/**
 * 构建 Clash DNS 配置对象。
 * @param {BuildDnsConfigInput} params - 构建参数
 * @param {('redir-host'|'fake-ip')} params.mode - DNS 增强模式
 * @param {boolean} params.ipv6Enabled - 是否启用 IPv6
 * @param {string[]=} params.fakeIpFilter - fake-ip 过滤域名列表（可选）
 * @returns {DnsConfig} DNS 配置对象
 */
function buildDnsConfig({ mode, ipv6Enabled, fakeIpFilter }: BuildDnsConfigInput): DnsConfig {
    const config: DnsConfig = {
        enable: true,
        ipv6: ipv6Enabled,
        "prefer-h3": true,
        "enhanced-mode": mode,
        nameserver: ["system", "223.5.5.5", "119.29.29.29", "180.184.1.1"],
        fallback: [
            "quic://dns0.eu",
            "https://dns.cloudflare.com/dns-query",
            "https://dns.sb/dns-query",
            "tcp://208.67.222.222",
            "tcp://8.26.56.2",
        ],
    };

    if (fakeIpFilter) {
        config["fake-ip-filter"] = fakeIpFilter;
    }

    return config;
}

/**
 * 构建 DNS 配置的输入参数类型（外部接口）。
 */
export interface BuildDnsInput {
    fakeIPEnabled: boolean;
    ipv6Enabled: boolean;
    /** 上游订阅提供的 DNS 配置，将按字段规则继承或融合。 */
    upstreamDns?: DnsConfig;
}

/**
 * 根据 fakeIP 和 IPv6 开关生成最终 DNS 配置。
 * @param {BuildDnsInput} params - 构建参数
 * @param {boolean} params.fakeIPEnabled - 是否启用 fake-ip 模式
 * @param {boolean} params.ipv6Enabled - 是否启用 IPv6
 * @param {DnsConfig} params.upstreamDns - 上游 DNS 配置（可选）
 * @returns {DnsConfig} DNS 配置对象
 */
export function buildDns({ fakeIPEnabled, ipv6Enabled, upstreamDns }: BuildDnsInput): DnsConfig {
    const generated = fakeIPEnabled
        ? buildDnsConfig({ mode: "fake-ip", ipv6Enabled, fakeIpFilter: FAKE_IP_FILTER })
        : buildDnsConfig({ mode: "redir-host", ipv6Enabled });

    return inheritDnsFields(generated, upstreamDns);
}
