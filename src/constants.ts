import type { CountryMeta } from "./types";

export const NODE_SUFFIX = "节点";
export const CDN_URL = "https://cdn.jsdelivr.net";

/**
 * `LANDING_PATTERN` 与 `LANDING_REGEX` 描述同一规则，但格式不同：
 * - `LANDING_REGEX`：JS `RegExp` 对象，供脚本内部过滤节点时使用（用 `/i` flag 表示不区分大小写）。
 * - `LANDING_PATTERN`：字符串，写入 YAML 的 `filter` / `exclude-filter` 字段，
 * 其中 `(?i)` 前缀是 Clash/Mihomo 的不区分大小写语法。
 */
export const LOW_COST_FILTER = "0\\.[0-9]|低倍率|省流|实验性|免费";
export const LOW_COST_GROUP_PATTERN = "(?i)0\\.[0-9]|低倍率|省流|实验性|免费";
export const LOW_COST_REGEX = new RegExp(LOW_COST_FILTER, "i");

// 【新增】专属冷门节点排除规则 (用于配合 Clash 的 exclude-filter 参数使用)
// 逻辑：把所有主流地区、低倍率、落地专用的字眼全部列入黑名单，剩下的就是纯正的冷门节点
export const COLD_NODES_EXCLUDE_PATTERN = "(?i)香港|港|HK|hk|Hong Kong|HongKong|hongkong|HKG|台|新北|彰化|TW|Taiwan|TPE|KHH|新加坡|坡|狮城|SG|Singapore|SIN|日本|川日|东京|大阪|泉日|埼玉|沪日|深日|[^-]日|JP|Japan|Tokyo|NRT|KIX|KR|Korea|KOR|Seoul|首尔|春川|韩|韓|ICN|美国|美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States|ATL|BUF|DFW|EWR|IAD|LAX|MCI|MIA|ORD|PHX|PDX|SEA|SJC|0\\.[0-9]|低倍率|省流|实验性|免费|家宽|家庭宽带|商宽|商业宽带|星链|Starlink|落地";

export const LANDING_REGEX = /家宽|家庭宽带|商宽|商业宽带|星链|Starlink|落地/i;
export const LANDING_PATTERN = "(?i)家宽|家庭宽带|商宽|商业宽带|星链|Starlink|落地";

export const FEATURE_FLAG_DEFAULTS = {
    loadBalance: false,
    landing: false,
    ipv6Enabled: false,
    fullConfig: false,
    keepAliveEnabled: false,
    fakeIPEnabled: true,
    quicEnabled: false,
    regexFilter: true, // 默认开启正则动态过滤
} as const;

export const PROXY_GROUPS = {
    SELECT: "选择代理",
    MANUAL: "手动选择",
    AUTO: "自动选择",
    FALLBACK: "故障转移",
    LANDING: "落地节点",
    FRONT_PROXY: "前置代理",
    CRYPTO: "加密货币",
    AI_SERVICE: "AI服务",
    YOUTUBE: "YouTube",
    GOOGLE: "谷歌服务",
    MICROSOFT: "微软服务",
    APPLE: "苹果服务",
    TELEGRAM: "Telegram",
    SPOTIFY: "Spotify",
    BILIBILI: "哔哩哔哩",
    NETFLIX: "Netflix",
    TIKTOK: "TikTok",
    AD_BLOCK: "广告拦截",
    COLD_NODES: "冷门节点", 
    LOW_COST: "低倍率节点",
    GLOBAL: "GLOBAL",
} as const;

export const ruleProviders = {
    ADBlock: {
        type: "http",
        behavior: "domain",
        format: "mrs",
        interval: 86400,
        url: `${CDN_URL}/gh/217heidai/adblockfilters@main/rules/adblockmihomolite.mrs`,
        path: "./ruleset/ADBlock.mrs",
    },
    TikTok: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/TikTok.list`,
        path: "./ruleset/TikTok.list",
    },
    SteamFix: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/SteamFix.list`,
        path: "./ruleset/SteamFix.list",
    },
    GoogleFCM: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/FirebaseCloudMessaging.list`,
        path: "./ruleset/FirebaseCloudMessaging.list",
    },
    AdditionalFilter: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/AdditionalFilter.list`,
        path: "./ruleset/AdditionalFilter.list",
    },
    Crypto: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/Crypto.list`,
        path: "./ruleset/Crypto.list",
    },
};

export const baseRules = [
    `RULE-SET,ADBlock,${PROXY_GROUPS.AD_BLOCK}`,
    `RULE-SET,AdditionalFilter,${PROXY_GROUPS.AD_BLOCK}`,
    `RULE-SET,Crypto,${PROXY_GROUPS.CRYPTO}`,
    `RULE-SET,TikTok,${PROXY_GROUPS.TIKTOK}`,
    `RULE-SET,SteamFix,DIRECT`,
    `RULE-SET,GoogleFCM,DIRECT`,
    `GEOSITE,YOUTUBE,${PROXY_GROUPS.YOUTUBE}`,
    `GEOSITE,TELEGRAM,${PROXY_GROUPS.TELEGRAM}`,
    `GEOSITE,CATEGORY-AI-!CN,${PROXY_GROUPS.AI_SERVICE}`,
    `GEOSITE,GOOGLE-PLAY@CN,DIRECT`,
    `GEOSITE,MICROSOFT@CN,DIRECT`,
    `GEOSITE,APPLE,${PROXY_GROUPS.APPLE}`,
    `GEOSITE,MICROSOFT,${PROXY_GROUPS.MICROSOFT}`,
    `GEOSITE,GOOGLE,${PROXY_GROUPS.GOOGLE}`,
    `GEOSITE,NETFLIX,${PROXY_GROUPS.NETFLIX}`,
    `GEOSITE,SPOTIFY,${PROXY_GROUPS.SPOTIFY}`,
    `GEOSITE,BILIBILI,${PROXY_GROUPS.BILIBILI}`,
    `GEOSITE,GFW,${PROXY_GROUPS.SELECT}`,
    `GEOSITE,CN,DIRECT`,
    `GEOSITE,PRIVATE,DIRECT`,
    `GEOIP,NETFLIX,${PROXY_GROUPS.NETFLIX},no-resolve`,
    `GEOIP,TELEGRAM,${PROXY_GROUPS.TELEGRAM},no-resolve`,
    `GEOIP,CN,DIRECT`,
    `GEOIP,PRIVATE,DIRECT`,
    `MATCH,${PROXY_GROUPS.SELECT}`,
];

export const snifferConfig = {
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

export const FAKE_IP_FILTER = [
    "geosite:private",
    "geosite:connectivity-check",
    "geosite:cn",
    "Mijia Cloud",
    "dig.io.mi.com",
    "localhost.ptlogin2.qq.com",
    "*.icloud.com",
    "*.stun.*.*",
    "*.stun.*.*.*",
];

export const geoxURL = {
    geoip: `${CDN_URL}/gh/Loyalsoldier/v2ray-rules-dat@release/geoip.dat`,
    geosite: `${CDN_URL}/gh/Loyalsoldier/v2ray-rules-dat@release/geosite.dat`,
    mmdb: `${CDN_URL}/gh/Loyalsoldier/geoip@release/Country.mmdb`,
    asn: `${CDN_URL}/gh/Loyalsoldier/geoip@release/GeoLite2-ASN.mmdb`,
};

/**
 * 各地区的元数据：`weight` 决定在代理组列表中的排列顺序（值越小越靠前，未设置则排末尾）；
 * `pattern` 是用于匹配节点名称的正则字符串。
 */
export const countriesMeta: Record<string, CountryMeta> = {
    香港: {
        weight: 10,
        pattern: "香港|港|HK|hk|Hong Kong|HongKong|hongkong|HKG|🇭🇰",
    },
    台湾: {
        weight: 20,
        pattern: "台|新北|彰化|TW|Taiwan|TPE|KHH|🇹🇼",
    },
    日本: {
        weight: 30, // 【修改】排序调整为第 3
        pattern: "日本|川日|东京|大阪|泉日|埼玉|沪日|深日|[^-]日|JP|Japan|Tokyo|NRT|KIX|🇯🇵",
    },
    美国: {
        weight: 40, // 【修改】排序调整为第 4
        pattern: "美国|美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States|ATL|BUF|DFW|EWR|IAD|LAX|MCI|MIA|ORD|PHX|PDX|SEA|SJC|🇺🇸",
    },
    韩国: {
        weight: 50, // 【修改】排序调整为第 5
        pattern: "KR|Korea|KOR|Seoul|首尔|春川|韩|韓|ICN|🇰🇷",
    },
    新加坡: {
        weight: 60, // 【修改】排序调整为第 6
        pattern: "新加坡|坡|狮城|SG|Singapore|SIN|🇸🇬",
    },
};
