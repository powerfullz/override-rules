/*!
powerfullz 的 Substore 订阅转换脚本
https://github.com/powerfullz/override-rules

支持的传入参数：
- loadbalance: 启用负载均衡（url-test/load-balance，默认 false）
- landing: 启用落地节点功能（如机场家宽/星链/落地分组，默认 false）
- ipv6: 启用 IPv6 支持（默认 false）
- full: 输出完整配置（适合纯内核启动，默认 false）
- keepalive: 启用 tcp-keep-alive（默认 false）
- fakeip: DNS 使用 FakeIP 模式（默认 false，false 为 RedirHost）
- quic: 允许 QUIC 流量（UDP 443，默认 false）
- threshold: 国家节点数量小于该值时不显示分组 (默认 0)
- regex: 使用正则过滤模式（include-all + filter）写入各国家代理组，而非直接枚举节点名称（默认 false）
*/

const NODE_SUFFIX = "节点";

function parseBool(value) {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
        return value.toLowerCase() === "true" || value === "1";
    }
    return false;
}

function parseNumber(value, defaultValue = 0) {
    if (value === null || typeof value === "undefined") {
        return defaultValue;
    }
    const num = parseInt(value, 10);
    return isNaN(num) ? defaultValue : num;
}

/**
 * 解析传入的脚本参数，并将其转换为内部使用的功能开关（feature flags）。
 * @param {object} args - 传入的原始参数对象，如 $arguments。
 * @returns {object} - 包含所有功能开关状态的对象。
 *
 * 该函数通过一个 `spec` 对象定义了外部参数名（如 `loadbalance`）到内部变量名（如 `loadBalance`）的映射关系。
 * 它会遍历 `spec` 中的每一项，对 `args` 对象中对应的参数值调用 `parseBool` 函数进行布尔化处理，
 * 并将结果存入返回的对象中。
 */
function buildFeatureFlags(args) {
    const spec = {
        loadbalance: "loadBalance",
        landing: "landing",
        ipv6: "ipv6Enabled",
        full: "fullConfig",
        keepalive: "keepAliveEnabled",
        fakeip: "fakeIPEnabled",
        quic: "quicEnabled",
        regex: "regexFilter",
    };

    const flags = Object.entries(spec).reduce((acc, [sourceKey, targetKey]) => {
        acc[targetKey] = parseBool(args[sourceKey]) || false;
        return acc;
    }, {});

    /**
     * `threshold` 是数字参数，不经过 parseBool，需单独处理。
     */
    flags.countryThreshold = parseNumber(args.threshold, 0);

    return flags;
}

const rawArgs = typeof $arguments !== "undefined" ? $arguments : {};
const {
    loadBalance,
    landing,
    ipv6Enabled,
    fullConfig,
    keepAliveEnabled,
    fakeIPEnabled,
    quicEnabled,
    regexFilter,
    countryThreshold,
} = buildFeatureFlags(rawArgs);

function getCountryGroupNames(countryInfo, minCount) {
    const filtered = countryInfo.filter((item) => item.nodes.length >= minCount);

    /**
     * 按 `countriesMeta` 中的 `weight` 字段升序排列；
     * 未配置 `weight` 的地区排在末尾（视为 Infinity）。
     */
    filtered.sort((a, b) => {
        const wa = countriesMeta[a.country]?.weight ?? Infinity;
        const wb = countriesMeta[b.country]?.weight ?? Infinity;
        return wa - wb;
    });

    return filtered.map((item) => item.country + NODE_SUFFIX);
}

function stripNodeSuffix(groupNames) {
    const suffixPattern = new RegExp(`${NODE_SUFFIX}$`);
    return groupNames.map((name) => name.replace(suffixPattern, ""));
}

const PROXY_GROUPS = {
    SELECT: "选择代理",
    MANUAL: "手动选择",
    FALLBACK: "故障转移",
    DIRECT: "直连",
    LANDING: "落地节点",
    LOW_COST: "低倍率节点",
};

/**
 * 接受任意数量的元素（包括嵌套数组），展平后过滤掉所有假值（false、null、undefined 等），
 * 用于以声明式风格构建代理列表，让条件项直接写 `condition && value` 即可。
 */
const buildList = (...elements) => elements.flat().filter(Boolean);

function buildBaseLists({ landing, lowCostNodes, countryGroupNames }) {
    const lowCost = lowCostNodes.length > 0 || regexFilter;

    /**
     * "选择代理"组的顶层候选列表：故障转移 → 落地节点（可选）→ 各国家组 → 低倍率（可选）→ 手动 → 直连。
     */
    const defaultSelector = buildList(
        PROXY_GROUPS.FALLBACK,
        landing && PROXY_GROUPS.LANDING,
        countryGroupNames,
        lowCost && PROXY_GROUPS.LOW_COST,
        PROXY_GROUPS.MANUAL,
        "DIRECT"
    );

    /**
     * 大多数策略组的通用候选列表：以"选择代理"为首选，再跟各国家组、低倍率、手动、直连。
     */
    const defaultProxies = buildList(
        PROXY_GROUPS.SELECT,
        countryGroupNames,
        lowCost && PROXY_GROUPS.LOW_COST,
        PROXY_GROUPS.MANUAL,
        PROXY_GROUPS.DIRECT
    );

    /**
     * 直连优先的候选列表，用于 Bilibili 等国内服务：直连排首位，其余顺序与 defaultProxies 一致。
     */
    const defaultProxiesDirect = buildList(
        PROXY_GROUPS.DIRECT,
        countryGroupNames,
        lowCost && PROXY_GROUPS.LOW_COST,
        PROXY_GROUPS.SELECT,
        PROXY_GROUPS.MANUAL
    );

    /**
     * "故障转移"组的候选列表：落地节点（可选）→ 各国家组 → 低倍率（可选）→ 手动 → 直连。
     * 不包含"选择代理"自身，避免循环引用。
     */
    const defaultFallback = buildList(
        landing && PROXY_GROUPS.LANDING,
        countryGroupNames,
        lowCost && PROXY_GROUPS.LOW_COST,
        PROXY_GROUPS.MANUAL,
        "DIRECT"
    );

    return { defaultProxies, defaultProxiesDirect, defaultSelector, defaultFallback };
}

const ruleProviders = {
    ADBlock: {
        type: "http",
        behavior: "domain",
        format: "mrs",
        interval: 86400,
        url: "https://gcore.jsdelivr.net/gh/217heidai/adblockfilters@main/rules/adblockmihomolite.mrs",
        path: "./ruleset/ADBlock.mrs",
    },
    SogouInput: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: "https://ruleset.skk.moe/Clash/non_ip/sogouinput.txt",
        path: "./ruleset/SogouInput.txt",
    },
    StaticResources: {
        type: "http",
        behavior: "domain",
        format: "text",
        interval: 86400,
        url: "https://ruleset.skk.moe/Clash/domainset/cdn.txt",
        path: "./ruleset/StaticResources.txt",
    },
    CDNResources: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: "https://ruleset.skk.moe/Clash/non_ip/cdn.txt",
        path: "./ruleset/CDNResources.txt",
    },
    TikTok: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: "https://gcore.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/TikTok.list",
        path: "./ruleset/TikTok.list",
    },
    EHentai: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: "https://gcore.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/EHentai.list",
        path: "./ruleset/EHentai.list",
    },
    SteamFix: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: "https://gcore.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/SteamFix.list",
        path: "./ruleset/SteamFix.list",
    },
    GoogleFCM: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: "https://gcore.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/FirebaseCloudMessaging.list",
        path: "./ruleset/FirebaseCloudMessaging.list",
    },
    AdditionalFilter: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: "https://gcore.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/AdditionalFilter.list",
        path: "./ruleset/AdditionalFilter.list",
    },
    AdditionalCDNResources: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: "https://gcore.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/AdditionalCDNResources.list",
        path: "./ruleset/AdditionalCDNResources.list",
    },
    Crypto: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: "https://gcore.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/Crypto.list",
        path: "./ruleset/Crypto.list",
    },
};

const baseRules = [
    `RULE-SET,ADBlock,广告拦截`,
    `RULE-SET,AdditionalFilter,广告拦截`,
    `RULE-SET,SogouInput,搜狗输入法`,
    `DOMAIN-SUFFIX,truthsocial.com,Truth Social`,
    `RULE-SET,StaticResources,静态资源`,
    `RULE-SET,CDNResources,静态资源`,
    `RULE-SET,AdditionalCDNResources,静态资源`,
    `RULE-SET,Crypto,Crypto`,
    `RULE-SET,EHentai,E-Hentai`,
    `RULE-SET,TikTok,TikTok`,
    `RULE-SET,SteamFix,${PROXY_GROUPS.DIRECT}`,
    `RULE-SET,GoogleFCM,${PROXY_GROUPS.DIRECT}`,
    `DOMAIN,services.googleapis.cn,${PROXY_GROUPS.SELECT}`,
    "GEOSITE,CATEGORY-AI-!CN,AI",
    `GEOSITE,GOOGLE-PLAY@CN,${PROXY_GROUPS.DIRECT}`,
    `GEOSITE,MICROSOFT@CN,${PROXY_GROUPS.DIRECT}`,
    "GEOSITE,ONEDRIVE,OneDrive",
    "GEOSITE,MICROSOFT,Microsoft",
    "GEOSITE,TELEGRAM,Telegram",
    "GEOSITE,YOUTUBE,YouTube",
    "GEOSITE,GOOGLE,Google",
    "GEOSITE,NETFLIX,Netflix",
    "GEOSITE,SPOTIFY,Spotify",
    "GEOSITE,BAHAMUT,Bahamut",
    "GEOSITE,BILIBILI,Bilibili",
    "GEOSITE,PIKPAK,PikPak",
    `GEOSITE,GFW,${PROXY_GROUPS.SELECT}`,
    `GEOSITE,CN,${PROXY_GROUPS.DIRECT}`,
    `GEOSITE,PRIVATE,${PROXY_GROUPS.DIRECT}`,
    "GEOIP,NETFLIX,Netflix,no-resolve",
    "GEOIP,TELEGRAM,Telegram,no-resolve",
    `GEOIP,CN,${PROXY_GROUPS.DIRECT}`,
    `GEOIP,PRIVATE,${PROXY_GROUPS.DIRECT}`,
    "DST-PORT,22,SSH(22端口)",
    `MATCH,${PROXY_GROUPS.SELECT}`,
];

function buildRules({ quicEnabled }) {
    const ruleList = [...baseRules];
    if (!quicEnabled) {
        /**
         * 屏蔽 UDP 443（QUIC）流量。
         * 部分网络环境下 UDP 性能不稳定，禁用 QUIC 可强制回退到 TCP，改善整体体验。
         */
        ruleList.unshift("AND,((DST-PORT,443),(NETWORK,UDP)),REJECT");
    }
    return ruleList;
}

const snifferConfig = {
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

function buildDnsConfig({ mode, fakeIpFilter }) {
    const config = {
        enable: true,
        ipv6: ipv6Enabled,
        "prefer-h3": true,
        "enhanced-mode": mode,
        "default-nameserver": ["119.29.29.29", "223.5.5.5"],
        nameserver: ["system", "223.5.5.5", "119.29.29.29", "180.184.1.1"],
        fallback: [
            "quic://dns0.eu",
            "https://dns.cloudflare.com/dns-query",
            "https://dns.sb/dns-query",
            "tcp://208.67.222.222",
            "tcp://8.26.56.2",
        ],
        "proxy-server-nameserver": ["https://dns.alidns.com/dns-query", "tls://dot.pub"],
    };

    if (fakeIpFilter) {
        config["fake-ip-filter"] = fakeIpFilter;
    }

    return config;
}

const dnsConfig = buildDnsConfig({ mode: "redir-host" });
const dnsConfigFakeIp = buildDnsConfig({
    mode: "fake-ip",
    fakeIpFilter: [
        "geosite:private",
        "geosite:connectivity-check",
        "geosite:cn",
        "Mijia Cloud",
        "dig.io.mi.com",
        "localhost.ptlogin2.qq.com",
        "*.icloud.com",
        "*.stun.*.*",
        "*.stun.*.*.*",
    ],
});

const geoxURL = {
    geoip: "https://gcore.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/geoip.dat",
    geosite: "https://gcore.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/geosite.dat",
    mmdb: "https://gcore.jsdelivr.net/gh/Loyalsoldier/geoip@release/Country.mmdb",
    asn: "https://gcore.jsdelivr.net/gh/Loyalsoldier/geoip@release/GeoLite2-ASN.mmdb",
};

/**
 * 各地区的元数据：`weight` 决定在代理组列表中的排列顺序（值越小越靠前，未设置则排末尾）；
 * `pattern` 是用于匹配节点名称的正则字符串；`icon` 为策略组图标 URL。
 */
const countriesMeta = {
    香港: {
        weight: 10,
        pattern: "香港|港|HK|hk|Hong Kong|HongKong|hongkong|🇭🇰",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png",
    },
    澳门: {
        pattern: "澳门|MO|Macau|🇲🇴",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Macao.png",
    },
    台湾: {
        weight: 20,
        pattern: "台|新北|彰化|TW|Taiwan|🇹🇼",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png",
    },
    新加坡: {
        weight: 30,
        pattern: "新加坡|坡|狮城|SG|Singapore|🇸🇬",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png",
    },
    日本: {
        weight: 40,
        pattern: "日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan|🇯🇵",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png",
    },
    韩国: {
        pattern: "KR|Korea|KOR|首尔|韩|韓|🇰🇷",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Korea.png",
    },
    美国: {
        weight: 50,
        pattern: "美国|美|US|United States|🇺🇸",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png",
    },
    加拿大: {
        pattern: "加拿大|Canada|CA|🇨🇦",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Canada.png",
    },
    英国: {
        weight: 60,
        pattern: "英国|United Kingdom|UK|伦敦|London|🇬🇧",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_Kingdom.png",
    },
    澳大利亚: {
        pattern: "澳洲|澳大利亚|AU|Australia|🇦🇺",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Australia.png",
    },
    德国: {
        weight: 70,
        pattern: "德国|德|DE|Germany|🇩🇪",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Germany.png",
    },
    法国: {
        weight: 80,
        pattern: "法国|法|FR|France|🇫🇷",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/France.png",
    },
    俄罗斯: {
        pattern: "俄罗斯|俄|RU|Russia|🇷🇺",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Russia.png",
    },
    泰国: {
        pattern: "泰国|泰|TH|Thailand|🇹🇭",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Thailand.png",
    },
    印度: {
        pattern: "印度|IN|India|🇮🇳",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/India.png",
    },
    马来西亚: {
        pattern: "马来西亚|马来|MY|Malaysia|🇲🇾",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Malaysia.png",
    },
};

const LOW_COST_REGEX = /0\.[0-5]|低倍率|省流|大流量|实验性/i;
const LANDING_REGEX = /家宽|家庭|家庭宽带|商宽|商业宽带|星链|Starlink|落地/i;
/**
 * `LANDING_PATTERN` 与 `LANDING_REGEX` 描述同一规则，但格式不同：
 * - `LANDING_REGEX`：JS `RegExp` 对象，供脚本内部过滤节点时使用（用 `/i` flag 表示不区分大小写）。
 * - `LANDING_PATTERN`：字符串，写入 YAML 的 `filter` / `exclude-filter` 字段，
 *   其中 `(?i)` 前缀是 Clash/Mihomo 的不区分大小写语法。
 */
const LANDING_PATTERN = "(?i)家宽|家庭|家庭宽带|商宽|商业宽带|星链|Starlink|落地";

function parseLowCost(config) {
    return (config.proxies || [])
        .filter((proxy) => LOW_COST_REGEX.test(proxy.name))
        .map((proxy) => proxy.name);
}

function parseLandingNodes(config) {
    return (config.proxies || [])
        .filter((proxy) => LANDING_REGEX.test(proxy.name))
        .map((proxy) => proxy.name);
}

/**
 * 遍历订阅中的所有节点，按 `countriesMeta` 中定义的地区进行归类。
 *
 * 归类规则：
 * - 名称匹配 `LANDING_REGEX` 的落地节点和匹配 `LOW_COST_REGEX` 的低倍率节点不参与统计。
 * - 每个节点只归入第一个匹配到的地区，避免重复计入。
 * - 地区正则来自 `countriesMeta[country].pattern`；若旧配置中 pattern 携带 `(?i)` 前缀，
 *   会在编译前自动剥离（JS RegExp 不支持该语法）。
 *
 * @param {object} config - 订阅配置对象，包含 `proxies` 数组。
 * @returns {{ country: string, nodes: string[] }[]} - 每个元素对应一个地区及其节点名称列表。
 */
function parseCountries(config) {
    const proxies = config.proxies || [];

    const countryNodes = Object.create(null);

    const compiledRegex = {};
    for (const [country, meta] of Object.entries(countriesMeta)) {
        compiledRegex[country] = new RegExp(meta.pattern.replace(/^\(\?i\)/, ""));
    }

    for (const proxy of proxies) {
        const name = proxy.name || "";

        if (LANDING_REGEX.test(name)) continue;
        if (LOW_COST_REGEX.test(name)) continue;

        for (const [country, regex] of Object.entries(compiledRegex)) {
            if (regex.test(name)) {
                if (!countryNodes[country]) countryNodes[country] = [];
                countryNodes[country].push(name);
                break;
            }
        }
    }

    const result = [];
    for (const [country, nodes] of Object.entries(countryNodes)) {
        result.push({ country, nodes });
    }

    return result;
}

function buildCountryProxyGroups({ countries, landing, loadBalance, regexFilter, countryInfo }) {
    const groups = [];
    const baseExcludeFilter = "0\\.[0-5]|低倍率|省流|大流量|实验性";
    const landingExcludeFilter = LANDING_PATTERN;
    const groupType = loadBalance ? "load-balance" : "url-test";

    /**
     * 枚举模式（`regexFilter=false`）下预先建立"地区 → 节点名列表"的索引，
     * 避免在循环内反复遍历 `countryInfo`。
     * regex 模式不需要此索引，置为 null 节省开销。
     */
    const nodesByCountry = !regexFilter
        ? Object.fromEntries(countryInfo.map((item) => [item.country, item.nodes]))
        : null;

    for (const country of countries) {
        const meta = countriesMeta[country];
        if (!meta) continue;

        let groupConfig;

        if (!regexFilter) {
            /**
             * 枚举模式：直接列出已归类到该地区的节点名称，无需运行时正则过滤。
             */
            const nodeNames = nodesByCountry[country] || [];
            groupConfig = {
                name: `${country}${NODE_SUFFIX}`,
                icon: meta.icon,
                type: groupType,
                proxies: nodeNames,
            };
        } else {
            /**
             * regex 模式：通过 `include-all` + `filter` 让内核在运行时动态筛选节点，
             * 同时用 `exclude-filter` 排除低倍率节点；若启用了落地功能，
             * 还需一并排除落地节点，防止其混入普通地区组。
             */
            groupConfig = {
                name: `${country}${NODE_SUFFIX}`,
                icon: meta.icon,
                "include-all": true,
                filter: meta.pattern,
                "exclude-filter": landing
                    ? `${landingExcludeFilter}|${baseExcludeFilter}`
                    : baseExcludeFilter,
                type: groupType,
            };
        }

        if (!loadBalance) {
            Object.assign(groupConfig, {
                url: "https://cp.cloudflare.com/generate_204",
                interval: 60,
                tolerance: 20,
                lazy: false,
            });
        }

        groups.push(groupConfig);
    }

    return groups;
}

function buildProxyGroups({
    landing,
    countries,
    countryProxyGroups,
    lowCostNodes,
    landingNodes,
    defaultProxies,
    defaultProxiesDirect,
    defaultSelector,
    defaultFallback,
}) {
    /**
     * 预先判断是否存在特定地区的节点，用于为 Bilibili、Bahamut、Truth Social 等
     * 有地区偏好的策略组提供更精准的候选列表。
     */
    const hasTW = countries.includes("台湾");
    const hasHK = countries.includes("香港");
    const hasUS = countries.includes("美国");

    /**
     * "前置代理"组的候选列表：从 `defaultSelector` 中移除"落地节点"和"故障转移"，
     * 避免前置代理与落地节点形成循环引用，以及与故障转移组相互嵌套。
     * 仅在 `landing=true` 时使用；否则置为空数组。
     */
    const frontProxySelector = landing
        ? defaultSelector.filter(
              (name) => name !== PROXY_GROUPS.LANDING && name !== PROXY_GROUPS.FALLBACK
          )
        : [];

    return [
        {
            name: PROXY_GROUPS.SELECT,
            icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png",
            type: "select",
            proxies: defaultSelector,
        },
        {
            name: PROXY_GROUPS.MANUAL,
            icon: "https://gcore.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/select.png",
            "include-all": true,
            type: "select",
        },
        landing
            ? {
                  name: "前置代理",
                  icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Area.png",
                  type: "select",
                  /**
                   * regex 模式：`include-all` 拉取所有节点，`exclude-filter` 排除落地节点，
                   * 同时在 `proxies` 里附加手动指定的候选组名列表（各国家组等）。
                   * 枚举模式：直接列出候选组名（落地节点已在构建 `frontProxySelector` 时过滤）。
                   */
                  ...(regexFilter
                      ? {
                            "include-all": true,
                            "exclude-filter": LANDING_PATTERN,
                            proxies: frontProxySelector,
                        }
                      : { proxies: frontProxySelector }),
              }
            : null,
        landing
            ? {
                  name: PROXY_GROUPS.LANDING,
                  icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Airport.png",
                  type: "select",
                  /**
                   * regex 模式：`include-all` + `filter` 动态筛选落地节点。
                   * 枚举模式：直接列出已识别的落地节点名称。
                   */
                  ...(regexFilter
                      ? { "include-all": true, filter: LANDING_PATTERN }
                      : { proxies: landingNodes }),
              }
            : null,
        {
            name: PROXY_GROUPS.FALLBACK,
            icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Bypass.png",
            type: "fallback",
            url: "https://cp.cloudflare.com/generate_204",
            proxies: defaultFallback,
            interval: 180,
            tolerance: 20,
            lazy: false,
        },
        {
            name: "静态资源",
            icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Cloudflare.png",
            type: "select",
            proxies: defaultProxies,
        },
        {
            name: "AI",
            icon: "https://gcore.jsdelivr.net/gh/powerfullz/override-rules@master/icons/chatgpt.png",
            type: "select",
            proxies: defaultProxies,
        },
        {
            name: "Crypto",
            icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Cryptocurrency_3.png",
            type: "select",
            proxies: defaultProxies,
        },
        {
            name: "Google",
            icon: "https://gcore.jsdelivr.net/gh/powerfullz/override-rules@master/icons/Google.png",
            type: "select",
            proxies: defaultProxies,
        },
        {
            name: "Microsoft",
            icon: "https://gcore.jsdelivr.net/gh/powerfullz/override-rules@master/icons/Microsoft_Copilot.png",
            type: "select",
            proxies: defaultProxies,
        },
        {
            name: "YouTube",
            icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png",
            type: "select",
            proxies: defaultProxies,
        },
        {
            name: "Bilibili",
            icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/bilibili.png",
            type: "select",
            proxies:
                hasTW && hasHK
                    ? [PROXY_GROUPS.DIRECT, "台湾节点", "香港节点"]
                    : defaultProxiesDirect,
        },
        {
            name: "Bahamut",
            icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Bahamut.png",
            type: "select",
            proxies: hasTW
                ? ["台湾节点", PROXY_GROUPS.SELECT, PROXY_GROUPS.MANUAL, PROXY_GROUPS.DIRECT]
                : defaultProxies,
        },
        {
            name: "Netflix",
            icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Netflix.png",
            type: "select",
            proxies: defaultProxies,
        },
        {
            name: "TikTok",
            icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/TikTok.png",
            type: "select",
            proxies: defaultProxies,
        },
        {
            name: "Spotify",
            icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Spotify.png",
            type: "select",
            proxies: defaultProxies,
        },
        {
            name: "E-Hentai",
            icon: "https://gcore.jsdelivr.net/gh/powerfullz/override-rules@master/icons/Ehentai.png",
            type: "select",
            proxies: defaultProxies,
        },
        {
            name: "Telegram",
            icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram.png",
            type: "select",
            proxies: defaultProxies,
        },
        {
            name: "Truth Social",
            icon: "https://gcore.jsdelivr.net/gh/powerfullz/override-rules@master/icons/TruthSocial.png",
            type: "select",
            proxies: hasUS
                ? ["美国节点", PROXY_GROUPS.SELECT, PROXY_GROUPS.MANUAL]
                : defaultProxies,
        },
        {
            name: "OneDrive",
            icon: "https://gcore.jsdelivr.net/gh/powerfullz/override-rules@master/icons/Onedrive.png",
            type: "select",
            proxies: defaultProxies,
        },
        {
            name: "PikPak",
            icon: "https://gcore.jsdelivr.net/gh/powerfullz/override-rules@master/icons/PikPak.png",
            type: "select",
            proxies: defaultProxies,
        },
        {
            name: "SSH(22端口)",
            icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Server.png",
            type: "select",
            proxies: defaultProxies,
        },
        {
            name: "搜狗输入法",
            icon: "https://gcore.jsdelivr.net/gh/powerfullz/override-rules@master/icons/Sougou.png",
            type: "select",
            proxies: [PROXY_GROUPS.DIRECT, "REJECT"],
        },
        {
            name: PROXY_GROUPS.DIRECT,
            icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Direct.png",
            type: "select",
            proxies: ["DIRECT", PROXY_GROUPS.SELECT],
        },
        {
            name: "广告拦截",
            icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AdBlack.png",
            type: "select",
            proxies: ["REJECT", "REJECT-DROP", PROXY_GROUPS.DIRECT],
        },
        lowCostNodes.length > 0 || regexFilter
            ? {
                  name: PROXY_GROUPS.LOW_COST,
                  icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Lab.png",
                  type: "url-test",
                  url: "https://cp.cloudflare.com/generate_204",
                  ...(!regexFilter
                      ? { proxies: lowCostNodes }
                      : { "include-all": true, filter: "(?i)0\\.[0-5]|低倍率|省流|大流量|实验性" }),
              }
            : null,
        ...countryProxyGroups,
    ].filter(Boolean);
}

// eslint-disable-next-line no-unused-vars -- 通过 vm.runInContext 在 yaml_generator 中被调用
function main(config) {
    const resultConfig = { proxies: config.proxies };

    /**
     * 解析订阅中的节点，分别得到：地区归类信息、低倍率节点名列表、落地节点名列表，
     * 以及经过阈值过滤和权重排序后的国家组名列表与地区名列表。
     */
    const countryInfo = parseCountries(resultConfig);
    const lowCostNodes = parseLowCost(resultConfig);
    const landingNodes = landing ? parseLandingNodes(resultConfig) : [];
    const countryGroupNames = getCountryGroupNames(countryInfo, countryThreshold);
    const countries = stripNodeSuffix(countryGroupNames);

    /**
     * 构建各类通用候选列表，供后续策略组复用。
     */
    const { defaultProxies, defaultProxiesDirect, defaultSelector, defaultFallback } =
        buildBaseLists({ landing, lowCostNodes, countryGroupNames });

    /**
     * 为每个地区生成对应的 `url-test` 或 `load-balance` 自动测速组。
     */
    const countryProxyGroups = buildCountryProxyGroups({
        countries,
        landing,
        loadBalance,
        regexFilter,
        countryInfo,
    });

    /**
     * 组装所有策略组（功能组 + 地区组）。
     */
    const proxyGroups = buildProxyGroups({
        landing,
        countries,
        countryProxyGroups,
        lowCostNodes,
        landingNodes,
        defaultProxies,
        defaultProxiesDirect,
        defaultSelector,
        defaultFallback,
    });

    /**
     * GLOBAL 组需要枚举所有已生成的策略组名称，因此在其他组构建完成后追加，
     * 同时保留 `include-all` 以确保与各内核的兼容性。
     */
    const globalProxies = proxyGroups.map((item) => item.name);
    proxyGroups.push({
        name: "GLOBAL",
        icon: "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
        "include-all": true,
        type: "select",
        proxies: globalProxies,
    });

    const finalRules = buildRules({ quicEnabled });

    if (fullConfig)
        Object.assign(resultConfig, {
            "mixed-port": 7890,
            "redir-port": 7892,
            "tproxy-port": 7893,
            "routing-mark": 7894,
            "allow-lan": true,
            "bind-address": "*",
            ipv6: ipv6Enabled,
            mode: "rule",
            "unified-delay": true,
            "tcp-concurrent": true,
            "find-process-mode": "off",
            "log-level": "info",
            "geodata-loader": "standard",
            "external-controller": ":9999",
            "disable-keep-alive": !keepAliveEnabled,
            profile: {
                "store-selected": true,
            },
        });

    Object.assign(resultConfig, {
        "proxy-groups": proxyGroups,
        "rule-providers": ruleProviders,
        rules: finalRules,
        sniffer: snifferConfig,
        dns: fakeIPEnabled ? dnsConfigFakeIp : dnsConfig,
        "geodata-mode": true,
        "geox-url": geoxURL,
    });

    return resultConfig;
}
