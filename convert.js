/*
hx1ang 的 Substore 订阅转换脚本
https://github.com/hx1ang/override-rules
传入参数：
- loadbalance: 启用负载均衡 (默认false)
- landing: 启用落地节点功能 (默认false)
- ipv6: 启用 IPv6 支持 (默认false)
- full: 启用完整配置，用于纯内核启动 (默认false)
- keepalive: 启用 tcp-keep-alive (默认false)
- fakeip: DNS 使用 FakeIP 而不是 RedirHost (默认false)
*/

const inArg = typeof $arguments !== 'undefined' ? $arguments : {};
const loadBalance = parseBool(inArg.loadbalance) || false,
    landing = parseBool(inArg.landing) || false,
    ipv6Enabled = parseBool(inArg.ipv6) || false,
    fullConfig = parseBool(inArg.full) || false,
    keepAliveEnabled = parseBool(inArg.keepalive) || false,
    fakeIPEnabled = parseBool(inArg.fakeip) || false;

function buildBaseLists({ landing, lowCost, countryInfo }) {
    const countryGroupNames = countryInfo
        .filter(item => item.count > 2)
        .map(item => item.country + "节点");

    // defaultSelector (选择节点 组里展示的候选) 
    // 故障转移, 落地节点(可选), 各地区节点, 低倍率节点(可选), 手动选择, DIRECT
    const selector = ["故障转移"]; // 把 fallback 放在最前
    if (landing) selector.push("落地节点");
    selector.push(...countryGroupNames);
    if (lowCost) selector.push("低倍率节点");
    selector.push("手动选择", "DIRECT");

    // defaultProxies (各分类策略引用) 
    // 选择节点, 各地区节点, 低倍率节点(可选), 手动选择, 直连
    const defaultProxies = ["选择节点", ...countryGroupNames];
    if (lowCost) defaultProxies.push("低倍率节点");
    defaultProxies.push("手动选择", "直连");

    // direct 优先的列表
    const defaultProxiesDirect = ["直连", ...countryGroupNames, "选择节点", "手动选择"]; // 直连优先
    if (lowCost) {
        // 在直连策略里低倍率次于地区、早于选择节点
        defaultProxiesDirect.splice(1 + countryGroupNames.length, 0, "低倍率节点");
    }

    const defaultFallback = [];
    if (landing) defaultFallback.push("落地节点");
    defaultFallback.push(...countryGroupNames);
    if (lowCost) defaultFallback.push("低倍率节点");
    // 可选是否加入 手动选择 / DIRECT；按容灾语义加入。
    defaultFallback.push("手动选择", "DIRECT");

    return { defaultProxies, defaultProxiesDirect, defaultSelector: selector, defaultFallback, countryGroupNames };
}

const ruleProviders = {
    "ADBlock": {
        "type": "http", "behavior": "domain", "format": "text", "interval": 86400,
        "url": "https://adrules.top/adrules_domainset.txt",
        "path": "./ruleset/ADBlock.txt"
    },
    "TruthSocial": {
        "url": "https://cdn.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/TruthSocial.list",
        "path": "./ruleset/TruthSocial.list",
        "behavior": "classical", "interval": 86400, "format": "text", "type": "http"
    },
    "SogouInput": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://ruleset.skk.moe/Clash/non_ip/sogouinput.txt",
        "path": "./ruleset/SogouInput.txt"
    },
    "StaticResources": {
        "type": "http", "behavior": "domain", "format": "text", "interval": 86400,
        "url": "https://ruleset.skk.moe/Clash/domainset/cdn.txt",
        "path": "./ruleset/StaticResources.txt"
    },
    "CDNResources": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://ruleset.skk.moe/Clash/non_ip/cdn.txt",
        "path": "./ruleset/CDNResources.txt"
    },
    "AI": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://ruleset.skk.moe/Clash/non_ip/ai.txt",
        "path": "./ruleset/AI.txt"
    },
    "TikTok": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://cdn.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/TikTok.list",
        "path": "./ruleset/TikTok.list"
    },
    "EHentai": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://cdn.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/EHentai.list",
        "path": "./ruleset/EHentai.list"
    },
    "SteamFix": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://cdn.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/SteamFix.list",
        "path": "./ruleset/SteamFix.list"
    },
    "GoogleFCM": {
        "type": "http", "behavior": "classical", "interval": 86400, "format": "text",
        "path": "./ruleset/FirebaseCloudMessaging.list",
        "url": "https://cdn.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/FirebaseCloudMessaging.list",
    },
    "AdditionalFilter": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://cdn.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/AdditionalFilter.list",
        "path": "./ruleset/AdditionalFilter.list"
    },
    "AdditionalCDNResources": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://cdn.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/AdditionalCDNResources.list",
        "path": "./ruleset/AdditionalCDNResources.list"
    },
    "Crypto": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://cdn.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/Crypto.list",
        "path": "./ruleset/Crypto.list"
    }
}

const rules = [
    "RULE-SET,ADBlock,广告拦截",
    "RULE-SET,AdditionalFilter,广告拦截",
    "RULE-SET,SogouInput,搜狗输入法",
    "RULE-SET,TruthSocial,Truth Social",
    "RULE-SET,StaticResources,静态资源",
    "RULE-SET,CDNResources,静态资源",
    "RULE-SET,AdditionalCDNResources,静态资源",
    "RULE-SET,AI,AI",
    "RULE-SET,Crypto,Crypto",
    "RULE-SET,EHentai,E-Hentai",
    "RULE-SET,TikTok,TikTok",
    "RULE-SET,SteamFix,直连",
    "RULE-SET,GoogleFCM,直连",
    "GEOSITE,GOOGLE-PLAY@CN,直连",
    "GEOSITE,TELEGRAM,Telegram",
    "GEOSITE,YOUTUBE,YouTube",
    "GEOSITE,NETFLIX,Netflix",
    "GEOSITE,SPOTIFY,Spotify",
    "GEOSITE,BAHAMUT,Bahamut",
    "GEOSITE,BILIBILI,Bilibili",
    "GEOSITE,MICROSOFT@CN,直连",
    "GEOSITE,PIKPAK,PikPak",
    "GEOSITE,GFW,选择节点",
    "GEOSITE,CN,直连",
    "GEOSITE,PRIVATE,直连",
    "GEOIP,NETFLIX,Netflix,no-resolve",
    "GEOIP,TELEGRAM,Telegram,no-resolve",
    "GEOIP,CN,直连",
    "GEOIP,PRIVATE,直连",
    "DST-PORT,22,SSH(22端口)",
    "MATCH,选择节点"
];

const snifferConfig = {
    "sniff": {
        "TLS": {
            "ports": [443, 8443],
        },
        "HTTP": {
            "ports": [80, 8080, 8880],
        },
        "QUIC": {
            "ports": [443, 8443],
        }
    },
    "override-destination": false,
    "enable": true,
    "force-dns-mapping": true,
    "skip-domain": [
        "Mijia Cloud",
        "dlg.io.mi.com",
        "+.push.apple.com"
    ]
};

const dnsConfig = {
    "enable": true,
    "ipv6": ipv6Enabled,
    "prefer-h3": true,
    "enhanced-mode": "redir-host",
    "default-nameserver": [
        "119.29.29.29",
        "223.5.5.5",
    ],
    "nameserver": [
        "system",
        "223.5.5.5",
        "119.29.29.29",
        "180.184.1.1",
    ],
    "fallback": [
        "quic://dns0.eu",
        "https://dns.cloudflare.com/dns-query",
        "https://dns.sb/dns-query",
        "tcp://208.67.222.222",
        "tcp://8.26.56.2"
    ],
    "proxy-server-nameserver": [
        "quic://223.5.5.5",
        "tls://dot.pub",
    ]
};

const dnsConfig2 = {
    // 提供使用 FakeIP 的 DNS 配置
    "enable": true,
    "ipv6": ipv6Enabled,
    "prefer-h3": true,
    "enhanced-mode": "fake-ip",
    "fake-ip-filter": [
        "geosite:private",
        "geosite:connectivity-check",
        "geosite:cn",
        "Mijia Cloud",
        "dig.io.mi.com",
        "localhost.ptlogin2.qq.com",
        "*.icloud.com",
        "*.stun.*.*",
        "*.stun.*.*.*"
    ],
    "default-nameserver": [
        "119.29.29.29",
        "223.5.5.5",
    ],
    "nameserver": [
        "system",
        "223.5.5.5",
        "119.29.29.29",
        "180.184.1.1",
    ],
    "fallback": [
        "quic://dns0.eu",
        "https://dns.cloudflare.com/dns-query",
        "https://dns.sb/dns-query",
        "tcp://208.67.222.222",
        "tcp://8.26.56.2"
    ],
    "proxy-server-nameserver": [
        "quic://223.5.5.5",
        "tls://dot.pub",
    ]
};

const geoxURL = {
    "geoip": "https://cdn.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/geoip.dat",
    "geosite": "https://cdn.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/geosite.dat",
    "mmdb": "https://cdn.jsdelivr.net/gh/Loyalsoldier/geoip@release/Country.mmdb",
    "asn": "https://cdn.jsdelivr.net/gh/Loyalsoldier/geoip@release/GeoLite2-ASN.mmdb"
};

// 地区元数据
const countriesMeta = {
    "香港": {
    pattern: "(?i)香港|港|HK|hk|Hong Kong|HongKong|hongkong|🇭🇰",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png"
    },
    "澳门": {
    pattern: "(?i)澳门|MO|Macau|🇲🇴",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Macao.png"
    },
    "台湾": {
    pattern: "(?i)台|新北|彰化|TW|Taiwan|🇹🇼",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png"
    },
    "新加坡": {
    pattern: "(?i)新加坡|坡|狮城|SG|Singapore|🇸🇬",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png"
    },
    "日本": {
    pattern: "(?i)日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan|🇯🇵",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png"
    },
    "韩国": {
    pattern: "(?i)KR|Korea|KOR|首尔|韩|韓|🇰🇷",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Korea.png"
    },
    "美国": {
    pattern: "(?i)美国|美|US|United States|🇺🇸",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png"
    },
    "加拿大": {
    pattern: "(?i)加拿大|Canada|CA|🇨🇦",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Canada.png"
    },
    "英国": {
    pattern: "(?i)英国|United Kingdom|UK|伦敦|London|🇬🇧",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_Kingdom.png"
    },
    "澳大利亚": {
    pattern: "(?i)澳洲|澳大利亚|AU|Australia|🇦🇺",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Australia.png"
    },
    "德国": {
    pattern: "(?i)德国|德|DE|Germany|🇩🇪",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Germany.png"
    },
    "法国": {
    pattern: "(?i)法国|法|FR|France|🇫🇷",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/France.png"
    },
    "俄罗斯": {
    pattern: "(?i)俄罗斯|俄|RU|Russia|🇷🇺",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Russia.png"
    },
    "泰国": {
    pattern: "(?i)泰国|泰|TH|Thailand|🇹🇭",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Thailand.png"
    },
    "印度": {
    pattern: "(?i)印度|IN|India|🇮🇳",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/India.png"
    },
    "马来西亚": {
    pattern: "(?i)马来西亚|马来|MY|Malaysia|🇲🇾",
        icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Malaysia.png"
    },
};

function parseBool(value) {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
        return value.toLowerCase() === "true" || value === "1";
    }
    return false;
}

function hasLowCost(config) {
    // 检查是否有低倍率节点
    const proxies = config["proxies"];
    const lowCostRegex = new RegExp(/0\.[0-5]|低倍率|省流|大流量|实验性/, 'i');
    for (const proxy of proxies) {
        if (lowCostRegex.test(proxy.name)) {
            return true;
        }
    }
    return false;
}

function parseCountries(config) {
    const proxies = config.proxies || [];
    const ispRegex = /家宽|家庭|家庭宽带|商宽|商业宽带|星链|Starlink|落地/i;   // 需要排除的关键字

    // 用来累计各国节点数
    const countryCounts = Object.create(null);

    // 构建地区正则表达式，去掉 (?i) 前缀
    const compiledRegex = {};
    for (const [country, meta] of Object.entries(countriesMeta)) {
        compiledRegex[country] = new RegExp(
            meta.pattern.replace(/^\(\?i\)/, ''),
            'i'
        );
    }

    // 逐个节点进行匹配与统计
    for (const proxy of proxies) {
        const name = proxy.name || '';

        // 过滤掉不想统计的 ISP 节点
        if (ispRegex.test(name)) continue;

        // 找到第一个匹配到的地区就计数并终止本轮
        for (const [country, regex] of Object.entries(compiledRegex)) {
            if (regex.test(name)) {
                countryCounts[country] = (countryCounts[country] || 0) + 1;
                break;    // 避免一个节点同时累计到多个地区
            }
        }
    }

    // 将结果对象转成数组形式
    const result = [];
    for (const [country, count] of Object.entries(countryCounts)) {
        result.push({ country, count });
    }

    return result;   // [{ country: 'Japan', count: 12 }, ...]
}


function buildCountryProxyGroups(countryList) {
    // 获取实际存在的地区列表
    const countryProxyGroups = [];

    // 为实际存在的地区创建节点组
    for (const country of countryList) {
        // 确保地区名称在预设的地区配置中存在
        if (countriesMeta[country]) {
            const groupName = `${country}节点`;
            const pattern = countriesMeta[country].pattern;

            const groupConfig = {
                "name": groupName,
                "icon": countriesMeta[country].icon,
                "include-all": true,
                "filter": pattern,
                "exclude-filter": landing ? "(?i)家宽|家庭|家庭宽带|商宽|商业宽带|星链|Starlink|落地|0\.[0-5]|低倍率|省流|大流量|实验性" : "0\.[0-5]|低倍率|省流|大流量|实验性",
                "type": (loadBalance) ? "load-balance" : "url-test",
            };

            if (!loadBalance) {
                Object.assign(groupConfig, {
                    "url": "https://cp.cloudflare.com/generate_204",
                    "interval": 60,
                    "tolerance": 20,
                    "lazy": false
                });
            }

            countryProxyGroups.push(groupConfig);
        }
    }

    return countryProxyGroups;
}

function buildProxyGroups({
    countryList,
    countryProxyGroups,
    lowCost,
    defaultProxies,
    defaultProxiesDirect,
    defaultSelector,
    defaultFallback
}) {
    // 查看是否有特定地区的节点
    const hasTW = countryList.includes("台湾");
    const hasHK = countryList.includes("香港");
    const hasUS = countryList.includes("美国");
    // 排除落地节点、选择节点和故障转移以避免死循环
    const frontProxySelector = [
        ...defaultSelector.filter(name => name !== "落地节点" && name !== "故障转移")
    ];

    return [
        {
            "name": "选择节点",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png",
            "type": "select",
            "proxies": defaultSelector
        },
        {
            "name": "手动选择",
            "icon": "https://cdn.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/select.png",
            "include-all": true,
            "type": "select"
        },
        (landing) ? {
            "name": "前置代理",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Area.png",
            "type": "select",
            "include-all": true,
            "exclude-filter": "(?i)家宽|家庭|家庭宽带|商宽|商业宽带|星链|Starlink|落地",
            "proxies": frontProxySelector
        } : null,
        (landing) ? {
            "name": "落地节点",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Airport.png",
            "type": "select",
            "include-all": true,
            "filter": "(?i)家宽|家庭|家庭宽带|商宽|商业宽带|星链|Starlink|落地",
        } : null,
        {
            "name": "故障转移",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Bypass.png",
            "type": "fallback",
            "url": "https://cp.cloudflare.com/generate_204",
            "proxies": defaultFallback,
            "interval": 180,
            "tolerance": 20,
            "lazy": false
        },
        {
            "name": "静态资源",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Cloudflare.png",
            "type": "select",
            "proxies": defaultProxies,
        },
        {
            "name": "AI",
            "icon": "https://cdn.jsdelivr.net/gh/powerfullz/override-rules@master/icons/chatgpt.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "Telegram",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "YouTube",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "Bilibili",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/bilibili.png",
            "type": "select",
            "proxies": (hasTW && hasHK) ? ["直连", "台湾节点", "香港节点"] : defaultProxiesDirect
        },
        {
            "name": "Netflix",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Netflix.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "Spotify",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Spotify.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "TikTok",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/TikTok.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "E-Hentai",
            "icon": "https://cdn.jsdelivr.net/gh/powerfullz/override-rules@master/icons/Ehentai.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "PikPak",
            "icon": "https://cdn.jsdelivr.net/gh/powerfullz/override-rules@master/icons/PikPak.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "Truth Social",
            "icon": "https://cdn.jsdelivr.net/gh/powerfullz/override-rules@master/icons/TruthSocial.png",
            "type": "select",
            "proxies": (hasUS) ? ["美国节点", "选择节点", "手动选择"] : defaultProxies
        },
        {
            "name": "Bahamut",
            "icon": "https://cdn.jsdmirror.com/gh/Koolson/Qure@master/IconSet/Color/Bahamut.png",
            "type": "select",
            "proxies": (hasTW) ? ["台湾节点", "选择节点", "手动选择", "直连"] : defaultProxies
        },
        {
            "name": "Crypto",
            "icon": "https://cdn.jsdmirror.com/gh/Koolson/Qure@master/IconSet/Color/Cryptocurrency_3.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "SSH(22端口)",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Server.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "搜狗输入法",
            "icon": "https://cdn.jsdelivr.net/gh/powerfullz/override-rules@master/icons/Sougou.png",
            "type": "select",
            "proxies": [
                "直连", "REJECT"
            ]
        },
        {
            "name": "直连",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Direct.png",
            "type": "select",
            "proxies": [
                "DIRECT", "选择节点"
            ]
        },
        {
            "name": "广告拦截",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AdBlack.png",
            "type": "select",
            "proxies": [
                "REJECT", "直连"
            ]
        },
        (lowCost) ? {
            "name": "低倍率节点",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Lab.png",
            "type": "url-test",
            "url": "https://cp.cloudflare.com/generate_204",
            "include-all": true,
            "filter": "(?i)0\.[0-5]|低倍率|省流|大流量|实验性"
        } : null,
        ...countryProxyGroups
    ].filter(Boolean); // 过滤掉 null 值
}

function main(config) {
    config = { proxies: config.proxies };
    // 解析地区与低倍率信息
    const countryInfo = parseCountries(config); // [{ country, count }]
    const lowCost = hasLowCost(config);

    // 构建基础数组
    const {
        defaultProxies,
        defaultProxiesDirect,
        defaultSelector,
        defaultFallback,
        countryGroupNames: targetCountryList
    } = buildBaseLists({ landing, lowCost, countryInfo });

    // 为地区构建对应的 url-test / load-balance 组
    const countryProxyGroups = buildCountryProxyGroups(targetCountryList.map(n => n.replace(/节点$/, '')));

    // 生成代理组
    const proxyGroups = buildProxyGroups({
        countryList: targetCountryList.map(n => n.replace(/节点$/, '')),
        countryProxyGroups,
        lowCost,
        defaultProxies,
        defaultProxiesDirect,
        defaultSelector,
        defaultFallback
    });
    const globalProxies = proxyGroups.map(item => item.name);
    
    proxyGroups.push(
        {
            "name": "GLOBAL",
            "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
            "include-all": true,
            "type": "select",
            "proxies": globalProxies
        }
    );

    if (fullConfig) Object.assign(config, {
        "mixed-port": 7890,
        "redir-port": 7892,
        "tproxy-port": 7893,
        "routing-mark": 7894,
        "allow-lan": true,
        "ipv6": ipv6Enabled,
        "mode": "rule",
        "unified-delay": true,
        "tcp-concurrent": true,
        "find-process-mode": "off",
        "log-level": "info",
        "geodata-loader": "standard",
        "external-controller": ":9999",
        "disable-keep-alive": !keepAliveEnabled,
        "profile": {
            "store-selected": true,
        }
    });

    Object.assign(config, {
        "proxy-groups": proxyGroups,
        "rule-providers": ruleProviders,
        "rules": rules,
        "sniffer": snifferConfig,
        "dns": fakeIPEnabled ? dnsConfig2 : dnsConfig,
        "geodata-mode": true,
        "geox-url": geoxURL,
    });

    return config;
}
