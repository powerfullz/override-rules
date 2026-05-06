/*!
powerfullz 的 Substore 订阅转换脚本
https://github.com/powerfullz/override-rules

支持的传入参数：
- loadbalance: 启用负载均衡（url-test/load-balance，默认 false）
- landing: 启用落地节点功能（如机场家宽/星链/落地分组，默认 false）
- ipv6: 启用 IPv6 支持（默认 false）
- full: 输出完整配置（适合纯内核启动，默认 false）
- keepalive: 启用 tcp-keep-alive（默认 false）
- fakeip: DNS 使用 FakeIP 模式（默认 true，false 为 RedirHost）
- quic: 允许 QUIC 流量（UDP 443，默认 false）
- threshold: 地区节点数量小于该值时不显示分组 (默认 0)
- regex: 使用正则过滤模式（include-all + filter）写入各地区代理组，而非直接枚举节点名称（默认 false）

源码说明：
- 源码已迁移至 `src/*.ts` 文件，使用 TypeScript 编写，编译后输出到 `dist/*.js`。
*/
"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/utils.ts
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
    const num = parseInt(String(value), 10);
    return Number.isNaN(num) ? defaultValue : num;
  }
  function buildList(...elements) {
    return elements.flat().filter(Boolean);
  }
  function createCaseInsensitiveNodeMatcher(source) {
    return {
      source,
      regex: new RegExp(source, "i"),
      pattern: `(?i)${source}`
    };
  }
  var init_utils = __esm({
    "src/utils.ts"() {
      "use strict";
    }
  });

  // src/constants.ts
  var NODE_SUFFIX, CDN_URL, PROXY_GROUPS, LOW_COST_NODE_MATCHER, LANDING_NODE_MATCHER, countriesMeta;
  var init_constants = __esm({
    "src/constants.ts"() {
      "use strict";
      init_utils();
      NODE_SUFFIX = "节点";
      CDN_URL = "https://cdn.jsdelivr.net";
      PROXY_GROUPS = {
        SELECT: "选择代理",
        MANUAL: "手动选择",
        AUTO: "自动选择",
        FALLBACK: "故障转移",
        DIRECT: "直连",
        LANDING: "落地节点",
        LOW_COST: "低倍率节点",
        FRONT_PROXY: "前置代理",
        STATIC_RESOURCES: "静态资源",
        AI_SERVICE: "AI服务",
        CRYPTO: "加密货币",
        APPLE: "苹果服务",
        GOOGLE: "谷歌服务",
        MICROSOFT: "微软服务",
        BILIBILI: "哔哩哔哩",
        BAHAMUT: "巴哈姆特",
        YOUTUBE: "Youtube",
        NETFLIX: "Netflix",
        TIKTOK: "TikTok",
        SPOTIFY: "Spotify",
        EHENTAI: "E-Hentai",
        TELEGRAM: "Telegram",
        TRUTH_SOCIAL: "Truth Social",
        TWITTER: "Twitter",
        WEIBO: "新浪微博",
        PIKPAK: "PikPak网盘",
        SSH: "SSH",
        SOGOU_INPUT: "搜狗输入法",
        AD_BLOCK: "广告拦截",
        GLOBAL: "GLOBAL"
      };
      LOW_COST_NODE_MATCHER = createCaseInsensitiveNodeMatcher(
        String.raw`0\.[0-5]|低倍率|省流|实验性`
      );
      LANDING_NODE_MATCHER = createCaseInsensitiveNodeMatcher(
        String.raw`家宽|家庭宽带|商宽|商业宽带|星链|Starlink|落地`
      );
      countriesMeta = {
        香港: {
          weight: 10,
          pattern: "香港|港|\\b(?:HK|hk)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Hong Kong|HongKong|hongkong|HONG KONG|HONGKONG|深港|HKG|九龙|Kowloon|新界|沙田|荃湾|葵涌|🇭🇰",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png`
        },
        澳门: {
          pattern: "澳门|\\b(?:MO|mo)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Macau|🇲🇴",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Macao.png`
        },
        台湾: {
          weight: 20,
          pattern: "台|新北|彰化|\\b(?:TW|tw)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Taiwan|TAIWAN|TWN|TPE|ROC|🇹🇼|🇼🇸",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png`
        },
        新加坡: {
          weight: 30,
          pattern: "新加坡|坡|狮城|\\b(?:SG|sg)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Singapore|SINGAPORE|SIN|🇸🇬",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Singapore.png`
        },
        日本: {
          weight: 40,
          pattern: "日本|川日|东京|大阪|泉日|埼玉|沪日|深日|\\b(?:JP|jp)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Japan|JAPAN|JPN|NRT|HND|KIX|TYO|OSA|关西|Kansai|KANSAI|🇯🇵",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Japan.png`
        },
        韩国: {
          pattern: "韩国|韩|韓|春川|Chuncheon|首尔|\\b(?:KR|kr)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Korea|KOREA|KOR|ICN|🇰🇷",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Korea.png`
        },
        美国: {
          weight: 50,
          pattern: "美国|美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|纽约|亚特兰大|迈阿密|华盛顿|\\b(?:US|us)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|United States|UnitedStates|UNITED STATES|USA|America|AMERICA|JFK|EWR|IAD|ATL|ORD|MIA|NYC|LAX|SFO|SEA|DFW|SJC|🇺🇸",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/United_States.png`
        },
        加拿大: {
          pattern: "加拿大|渥太华|温哥华|卡尔加里|蒙特利尔|Montreal|\\b(?:CA|ca)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Canada|CANADA|CAN|YVR|YYZ|YUL|🇨🇦",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Canada.png`
        },
        英国: {
          weight: 60,
          pattern: "英国|伦敦|曼彻斯特|Manchester|\\b(?:UK|uk)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Britain|United Kingdom|UNITED KINGDOM|England|GBR|LHR|MAN|🇬🇧",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/United_Kingdom.png`
        },
        澳大利亚: {
          pattern: "澳洲|澳大利亚|\\b(?:AU|au)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Australia|🇦🇺",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Australia.png`
        },
        德国: {
          weight: 70,
          pattern: "德国|德|柏林|法兰克福|慕尼黑|Munich|\\b(?:DE|de)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Germany|GERMANY|DEU|MUC|🇩🇪",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Germany.png`
        },
        法国: {
          weight: 80,
          pattern: "法国|法|巴黎|马赛|Marseille|\\b(?:FR|fr)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|France|FRANCE|FRA|CDG|MRS|🇫🇷",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/France.png`
        },
        俄罗斯: {
          pattern: "俄罗斯|俄|\\b(?:RU|ru)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Russia|🇷🇺",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Russia.png`
        },
        泰国: {
          pattern: "泰国|泰|\\b(?:TH|th)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Thailand|🇹🇭",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Thailand.png`
        },
        印度: {
          pattern: "印度|\\b(?:IN|in)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|India|🇮🇳",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/India.png`
        },
        马来西亚: {
          pattern: "马来西亚|马来|\\b(?:MY|my)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Malaysia|🇲🇾",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Malaysia.png`
        },
        阿根廷: {
          pattern: "阿根廷|布宜诺斯艾利斯|\\b(?:AR|ar)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Argentina|EZE|🇦🇷",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Argentina.png`
        },
        芬兰: {
          pattern: "芬兰|赫尔辛基|\\b(?:FI|fi)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Finland|HEL|🇫🇮",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Finland.png`
        },
        埃及: {
          pattern: "埃及|开罗|\\b(?:EG|eg)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Egypt|CAI|🇪🇬",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Egypt.png`
        },
        菲律宾: {
          pattern: "菲律宾|马尼拉|\\b(?:PH|ph)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Philippines|MNL|🇵🇭",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Philippines.png`
        },
        土耳其: {
          pattern: "土耳其|伊斯坦布尔|\\b(?:TR|tr)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Turkey|Türkiye|IST|🇹🇷",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Turkey.png`
        },
        乌克兰: {
          pattern: "乌克兰|基辅|\\b(?:UA|ua)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Ukraine|KBP|🇺🇦",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Ukraine.png`
        }
      };
    }
  });

  // src/args.ts
  function buildFeatureFlags(args) {
    const spec = {
      loadbalance: "loadBalance",
      landing: "landing",
      ipv6: "ipv6Enabled",
      full: "fullConfig",
      keepalive: "keepAliveEnabled",
      fakeip: "fakeIPEnabled",
      quic: "quicEnabled",
      regex: "regexFilter"
    };
    const flags = {
      ...FEATURE_FLAG_DEFAULTS,
      countryThreshold: 0
    };
    for (const [sourceKey, targetKey] of Object.entries(spec)) {
      const rawValue = args[sourceKey];
      if (rawValue === null || typeof rawValue === "undefined") {
        flags[targetKey] = FEATURE_FLAG_DEFAULTS[targetKey];
      } else {
        flags[targetKey] = parseBool(rawValue);
      }
    }
    flags.countryThreshold = parseNumber(args.threshold, 0);
    return flags;
  }
  var FEATURE_FLAG_DEFAULTS;
  var init_args = __esm({
    "src/args.ts"() {
      "use strict";
      init_utils();
      FEATURE_FLAG_DEFAULTS = {
        loadBalance: false,
        landing: false,
        ipv6Enabled: false,
        fullConfig: false,
        keepAliveEnabled: false,
        fakeIPEnabled: true,
        quicEnabled: false,
        regexFilter: false
      };
    }
  });

  // src/proxy_groups.ts
  function buildCountryProxyGroups({
    countries,
    landing,
    loadBalance,
    regexFilter,
    countryInfo
  }) {
    const groups = [];
    const groupType = loadBalance ? "load-balance" : "url-test";
    const nodesByCountry = !regexFilter ? Object.fromEntries(countryInfo.map((item) => [item.country, item.nodes])) : null;
    for (const country of countries) {
      const meta = countriesMeta[country];
      if (!meta) continue;
      const groupConfig = {
        name: `${country}${NODE_SUFFIX}`,
        icon: meta.icon,
        type: groupType,
        url: "https://cp.cloudflare.com/generate_204",
        interval: 60,
        tolerance: 20,
        ...loadBalance ? { strategy: "sticky-sessions" } : {}
      };
      if (!regexFilter) {
        const nodeNames = nodesByCountry?.[country] || [];
        groupConfig["proxies"] = nodeNames;
      } else {
        Object.assign(groupConfig, {
          "include-all": true,
          filter: meta.pattern
        });
        if (landing) groupConfig["exclude-filter"] = LANDING_NODE_MATCHER.pattern;
      }
      groups.push(groupConfig);
    }
    return groups;
  }
  function buildProxyGroups({
    landing,
    regexFilter,
    countries,
    countryProxyGroups,
    lowCostNodes,
    landingNodes,
    defaultProxies,
    defaultProxiesDirect,
    defaultSelector,
    defaultFallback,
    frontProxySelector
  }) {
    const hasTW = countries.includes("台湾");
    const hasHK = countries.includes("香港");
    const hasUS = countries.includes("美国");
    const groups = [
      {
        name: PROXY_GROUPS.SELECT,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Proxy.png`,
        type: "select",
        proxies: defaultSelector
      },
      {
        name: PROXY_GROUPS.MANUAL,
        icon: `${CDN_URL}/gh/shindgewongxj/WHATSINStash@master/icon/select.png`,
        "include-all": true,
        type: "select"
      },
      landing ? {
        name: PROXY_GROUPS.FRONT_PROXY,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Area.png`,
        type: "select",
        ...regexFilter ? {
          "include-all": true,
          "exclude-filter": LANDING_NODE_MATCHER.pattern,
          proxies: frontProxySelector
        } : { proxies: frontProxySelector }
      } : null,
      landing ? {
        name: PROXY_GROUPS.LANDING,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Airport.png`,
        type: "select",
        ...regexFilter ? { "include-all": true, filter: LANDING_NODE_MATCHER.pattern } : { proxies: landingNodes }
      } : null,
      {
        name: PROXY_GROUPS.STATIC_RESOURCES,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Cloudflare.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.AI_SERVICE,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/ChatGPT.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.CRYPTO,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Cryptocurrency_1.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.APPLE,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Apple_2.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.GOOGLE,
        icon: `${CDN_URL}/gh/Orz-3/mini@master/Color/Google.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.MICROSOFT,
        icon: `${CDN_URL}/gh/powerfullz/override-rules@master/icons/Microsoft_Copilot.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.BILIBILI,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/bilibili.png`,
        type: "select",
        proxies: hasTW && hasHK ? [PROXY_GROUPS.DIRECT, "台湾节点", "香港节点"] : defaultProxiesDirect
      },
      {
        name: PROXY_GROUPS.BAHAMUT,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Bahamut.png`,
        type: "select",
        proxies: hasTW ? ["台湾节点", PROXY_GROUPS.SELECT, PROXY_GROUPS.MANUAL, PROXY_GROUPS.DIRECT] : defaultProxies
      },
      {
        name: PROXY_GROUPS.YOUTUBE,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/YouTube.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.NETFLIX,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Netflix.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.TIKTOK,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/TikTok.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.SPOTIFY,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Spotify.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.TELEGRAM,
        icon: `${CDN_URL}/gh/powerfullz/override-rules@master/icons/Telegram.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.TWITTER,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Twitter.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.WEIBO,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Weibo.png`,
        type: "select",
        proxies: defaultProxiesDirect
      },
      {
        name: PROXY_GROUPS.TRUTH_SOCIAL,
        icon: `${CDN_URL}/gh/powerfullz/override-rules@master/icons/Truth_Social.png`,
        type: "select",
        proxies: hasUS ? ["美国节点", PROXY_GROUPS.SELECT, PROXY_GROUPS.MANUAL] : defaultProxies
      },
      {
        name: PROXY_GROUPS.EHENTAI,
        icon: `${CDN_URL}/gh/powerfullz/override-rules@master/icons/Ehentai.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.PIKPAK,
        icon: `${CDN_URL}/gh/powerfullz/override-rules@master/icons/PikPak.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.SOGOU_INPUT,
        icon: `${CDN_URL}/gh/powerfullz/override-rules@master/icons/Sougou.png`,
        type: "select",
        proxies: [PROXY_GROUPS.DIRECT, "REJECT"]
      },
      {
        name: PROXY_GROUPS.SSH,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Server.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.AUTO,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Auto.png`,
        type: "url-test",
        url: "https://cp.cloudflare.com/generate_204",
        proxies: defaultFallback,
        interval: 60,
        tolerance: 20
      },
      {
        name: PROXY_GROUPS.FALLBACK,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Available_1.png`,
        type: "fallback",
        url: "https://cp.cloudflare.com/generate_204",
        proxies: defaultFallback,
        interval: 60,
        tolerance: 20
      },
      {
        name: PROXY_GROUPS.DIRECT,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Direct.png`,
        type: "select",
        proxies: ["DIRECT", PROXY_GROUPS.SELECT]
      },
      {
        name: PROXY_GROUPS.AD_BLOCK,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/AdBlack.png`,
        type: "select",
        proxies: ["REJECT", "REJECT-DROP", PROXY_GROUPS.DIRECT]
      },
      lowCostNodes.length > 0 || regexFilter ? {
        name: PROXY_GROUPS.LOW_COST,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Lab.png`,
        type: "url-test",
        url: "https://cp.cloudflare.com/generate_204",
        interval: 60,
        tolerance: 20,
        ...!regexFilter ? { proxies: lowCostNodes } : { "include-all": true, filter: LOW_COST_NODE_MATCHER.pattern }
      } : null,
      ...countryProxyGroups
    ];
    return groups.filter(Boolean);
  }
  var init_proxy_groups = __esm({
    "src/proxy_groups.ts"() {
      "use strict";
      init_constants();
    }
  });

  // src/node_parser.ts
  function parseLowCost(config) {
    return (config.proxies || []).filter((proxy) => LOW_COST_NODE_MATCHER.regex.test(proxy.name || "")).map((proxy) => proxy.name).filter((name) => Boolean(name));
  }
  function parseNodesByLanding(config) {
    const landingNodes = [];
    const nonLandingNodes = [];
    for (const proxy of config.proxies || []) {
      const name = proxy.name;
      if (!name) continue;
      if (LANDING_NODE_MATCHER.regex.test(name)) {
        landingNodes.push(name);
        continue;
      }
      nonLandingNodes.push(name);
    }
    return { landingNodes, nonLandingNodes };
  }
  function parseCountries(config, landing = false) {
    const proxies = config.proxies || [];
    const countryNodes = /* @__PURE__ */ Object.create(null);
    for (const proxy of proxies) {
      const name = proxy.name || "";
      if (landing && LANDING_NODE_MATCHER.regex.test(name)) continue;
      for (const [country, regex] of Object.entries(COUNTRY_REGEX_MAP)) {
        if (!regex.test(name)) continue;
        if (!countryNodes[country]) {
          countryNodes[country] = [];
        }
        countryNodes[country].push(name);
        break;
      }
    }
    return Object.entries(countryNodes).map(([country, nodes]) => ({ country, nodes }));
  }
  function getCountryGroupNames(countryInfo, minCount) {
    const filtered = countryInfo.filter((item) => item.nodes.length >= minCount);
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
  var COUNTRY_REGEX_MAP;
  var init_node_parser = __esm({
    "src/node_parser.ts"() {
      "use strict";
      init_constants();
      COUNTRY_REGEX_MAP = Object.fromEntries(
        Object.entries(countriesMeta).map(([country, meta]) => {
          return [country, new RegExp(meta.pattern.replace(/^\(\?i\)/, ""))];
        })
      );
    }
  });

  // src/rules.ts
  function buildRules({ quicEnabled }) {
    const ruleList = [...baseRules];
    if (!quicEnabled) {
      ruleList.unshift("AND,((DST-PORT,443),(NETWORK,UDP)),REJECT");
    }
    return ruleList;
  }
  var baseRules;
  var init_rules = __esm({
    "src/rules.ts"() {
      "use strict";
      init_constants();
      baseRules = [
        `RULE-SET,ADBlock,${PROXY_GROUPS.AD_BLOCK}`,
        `RULE-SET,AdditionalFilter,${PROXY_GROUPS.AD_BLOCK}`,
        `RULE-SET,SogouInput,${PROXY_GROUPS.SOGOU_INPUT}`,
        `DOMAIN-SUFFIX,truthsocial.com,${PROXY_GROUPS.TRUTH_SOCIAL}`,
        `RULE-SET,StaticResources,${PROXY_GROUPS.STATIC_RESOURCES}`,
        `RULE-SET,CDNResources,${PROXY_GROUPS.STATIC_RESOURCES}`,
        `RULE-SET,AdditionalCDNResources,${PROXY_GROUPS.STATIC_RESOURCES}`,
        `RULE-SET,Crypto,${PROXY_GROUPS.CRYPTO}`,
        `RULE-SET,EHentai,${PROXY_GROUPS.EHENTAI}`,
        `RULE-SET,TikTok,${PROXY_GROUPS.TIKTOK}`,
        `RULE-SET,SteamFix,${PROXY_GROUPS.DIRECT}`,
        `RULE-SET,GoogleFCM,${PROXY_GROUPS.DIRECT}`,
        `RULE-SET,Weibo,${PROXY_GROUPS.WEIBO}`,
        `GEOSITE,YOUTUBE,${PROXY_GROUPS.YOUTUBE}`,
        `GEOSITE,CATEGORY-AI-!CN,${PROXY_GROUPS.AI_SERVICE}`,
        `GEOSITE,TELEGRAM,${PROXY_GROUPS.TELEGRAM}`,
        `GEOSITE,GOOGLE-PLAY@CN,${PROXY_GROUPS.DIRECT}`,
        `GEOSITE,MICROSOFT@CN,${PROXY_GROUPS.DIRECT}`,
        `GEOSITE,APPLE,${PROXY_GROUPS.APPLE}`,
        `GEOSITE,MICROSOFT,${PROXY_GROUPS.MICROSOFT}`,
        `GEOSITE,GOOGLE,${PROXY_GROUPS.GOOGLE}`,
        `GEOSITE,NETFLIX,${PROXY_GROUPS.NETFLIX}`,
        `GEOSITE,SPOTIFY,${PROXY_GROUPS.SPOTIFY}`,
        `GEOSITE,BAHAMUT,${PROXY_GROUPS.BAHAMUT}`,
        `GEOSITE,BILIBILI,${PROXY_GROUPS.BILIBILI}`,
        `GEOSITE,PIKPAK,${PROXY_GROUPS.PIKPAK}`,
        `GEOSITE,TWITTER,${PROXY_GROUPS.TWITTER}`,
        `GEOSITE,GFW,${PROXY_GROUPS.SELECT}`,
        `GEOSITE,CN,${PROXY_GROUPS.DIRECT}`,
        `GEOSITE,PRIVATE,${PROXY_GROUPS.DIRECT}`,
        `GEOIP,NETFLIX,${PROXY_GROUPS.NETFLIX},no-resolve`,
        `GEOIP,TELEGRAM,${PROXY_GROUPS.TELEGRAM},no-resolve`,
        `GEOIP,CN,${PROXY_GROUPS.DIRECT}`,
        `GEOIP,PRIVATE,${PROXY_GROUPS.DIRECT}`,
        `DST-PORT,22,${PROXY_GROUPS.SSH}`,
        `MATCH,${PROXY_GROUPS.SELECT}`
      ];
    }
  });

  // src/rule_providers.ts
  var ruleProviders;
  var init_rule_providers = __esm({
    "src/rule_providers.ts"() {
      "use strict";
      init_constants();
      ruleProviders = {
        ADBlock: {
          type: "http",
          behavior: "domain",
          format: "mrs",
          interval: 86400,
          url: `${CDN_URL}/gh/217heidai/adblockfilters@main/rules/adblockmihomolite.mrs`,
          path: "./ruleset/ADBlock.mrs"
        },
        SogouInput: {
          type: "http",
          behavior: "classical",
          format: "text",
          interval: 86400,
          url: "https://ruleset.skk.moe/Clash/non_ip/sogouinput.txt",
          path: "./ruleset/SogouInput.txt"
        },
        StaticResources: {
          type: "http",
          behavior: "domain",
          format: "text",
          interval: 86400,
          url: "https://ruleset.skk.moe/Clash/domainset/cdn.txt",
          path: "./ruleset/StaticResources.txt"
        },
        CDNResources: {
          type: "http",
          behavior: "classical",
          format: "text",
          interval: 86400,
          url: "https://ruleset.skk.moe/Clash/non_ip/cdn.txt",
          path: "./ruleset/CDNResources.txt"
        },
        TikTok: {
          type: "http",
          behavior: "classical",
          format: "text",
          interval: 86400,
          url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/TikTok.list`,
          path: "./ruleset/TikTok.list"
        },
        EHentai: {
          type: "http",
          behavior: "classical",
          format: "text",
          interval: 86400,
          url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/EHentai.list`,
          path: "./ruleset/EHentai.list"
        },
        SteamFix: {
          type: "http",
          behavior: "classical",
          format: "text",
          interval: 86400,
          url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/SteamFix.list`,
          path: "./ruleset/SteamFix.list"
        },
        GoogleFCM: {
          type: "http",
          behavior: "classical",
          format: "text",
          interval: 86400,
          url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/FirebaseCloudMessaging.list`,
          path: "./ruleset/FirebaseCloudMessaging.list"
        },
        AdditionalFilter: {
          type: "http",
          behavior: "classical",
          format: "text",
          interval: 86400,
          url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/AdditionalFilter.list`,
          path: "./ruleset/AdditionalFilter.list"
        },
        AdditionalCDNResources: {
          type: "http",
          behavior: "classical",
          format: "text",
          interval: 86400,
          url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/AdditionalCDNResources.list`,
          path: "./ruleset/AdditionalCDNResources.list"
        },
        Crypto: {
          type: "http",
          behavior: "classical",
          format: "text",
          interval: 86400,
          url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/Crypto.list`,
          path: "./ruleset/Crypto.list"
        },
        Weibo: {
          type: "http",
          behavior: "classical",
          format: "text",
          interval: 86400,
          url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/Weibo.list`,
          path: "./ruleset/Weibo.list"
        }
      };
    }
  });

  // src/dns.ts
  function buildDnsConfig({
    mode,
    ipv6Enabled,
    fakeIpFilter
  }) {
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
        "tcp://8.26.56.2"
      ],
      "proxy-server-nameserver": ["https://dns.alidns.com/dns-query", "tls://dot.pub"]
    };
    if (fakeIpFilter) {
      config["fake-ip-filter"] = fakeIpFilter;
    }
    return config;
  }
  function buildDns({ fakeIPEnabled, ipv6Enabled }) {
    if (fakeIPEnabled) {
      return buildDnsConfig({ mode: "fake-ip", ipv6Enabled, fakeIpFilter: FAKE_IP_FILTER });
    }
    return buildDnsConfig({ mode: "redir-host", ipv6Enabled });
  }
  var FAKE_IP_FILTER, snifferConfig;
  var init_dns = __esm({
    "src/dns.ts"() {
      "use strict";
      FAKE_IP_FILTER = [
        "geosite:private",
        "geosite:connectivity-check",
        "geosite:cn",
        "Mijia Cloud",
        "dig.io.mi.com",
        "localhost.ptlogin2.qq.com",
        "*.icloud.com",
        "*.stun.*.*",
        "*.stun.*.*.*"
      ];
      snifferConfig = {
        sniff: {
          TLS: {
            ports: [443, 8443]
          },
          HTTP: {
            ports: [80, 8080, 8880]
          },
          QUIC: {
            ports: [443, 8443]
          }
        },
        "override-destination": false,
        enable: true,
        "force-dns-mapping": true,
        "skip-domain": ["Mijia Cloud", "dlg.io.mi.com", "+.push.apple.com"]
      };
    }
  });

  // src/selectors.ts
  function buildBaseLists({
    landing,
    lowCostNodes,
    countryGroupNames,
    nonLandingNodes,
    regexFilter
  }) {
    const lowCost = lowCostNodes.length > 0 || regexFilter;
    const defaultSelector = buildList(
      PROXY_GROUPS.AUTO,
      PROXY_GROUPS.FALLBACK,
      landing && PROXY_GROUPS.LANDING,
      countryGroupNames,
      lowCost && PROXY_GROUPS.LOW_COST,
      PROXY_GROUPS.MANUAL,
      "DIRECT"
    );
    const defaultProxies = buildList(
      PROXY_GROUPS.SELECT,
      landing && PROXY_GROUPS.LANDING,
      countryGroupNames,
      lowCost && PROXY_GROUPS.LOW_COST,
      PROXY_GROUPS.MANUAL,
      PROXY_GROUPS.DIRECT
    );
    const defaultProxiesDirect = buildList(
      PROXY_GROUPS.DIRECT,
      landing && PROXY_GROUPS.LANDING,
      countryGroupNames,
      lowCost && PROXY_GROUPS.LOW_COST,
      PROXY_GROUPS.SELECT,
      PROXY_GROUPS.MANUAL
    );
    const defaultFallback = buildList(
      landing && PROXY_GROUPS.LANDING,
      countryGroupNames,
      lowCost && PROXY_GROUPS.LOW_COST,
      PROXY_GROUPS.MANUAL,
      "DIRECT"
    );
    const frontProxySelector = buildList(
      countryGroupNames,
      "DIRECT",
      !regexFilter && nonLandingNodes
    );
    return {
      defaultProxies,
      defaultProxiesDirect,
      defaultSelector,
      defaultFallback,
      frontProxySelector
    };
  }
  var init_selectors = __esm({
    "src/selectors.ts"() {
      "use strict";
      init_constants();
      init_utils();
    }
  });

  // src/main.ts
  var require_main = __commonJS({
    "src/main.ts"() {
      init_constants();
      init_args();
      init_proxy_groups();
      init_node_parser();
      init_rules();
      init_rule_providers();
      init_dns();
      init_selectors();
      var geoxURL = {
        geoip: `${CDN_URL}/gh/Loyalsoldier/v2ray-rules-dat@release/geoip.dat`,
        geosite: `${CDN_URL}/gh/Loyalsoldier/v2ray-rules-dat@release/geosite.dat`,
        mmdb: `${CDN_URL}/gh/Loyalsoldier/geoip@release/Country.mmdb`,
        asn: `${CDN_URL}/gh/Loyalsoldier/geoip@release/GeoLite2-ASN.mmdb`
      };
      function getRawArgs() {
        try {
          return $arguments;
        } catch {
          console.log("[powerfullz 的覆写脚本] 未检测到传入参数，使用默认参数。", {});
          return {};
        }
      }
      var rawArgs = getRawArgs();
      var {
        loadBalance,
        landing,
        ipv6Enabled,
        fullConfig,
        keepAliveEnabled,
        fakeIPEnabled,
        quicEnabled,
        regexFilter,
        countryThreshold
      } = buildFeatureFlags(rawArgs);
      function main(config) {
        const resultConfig = { proxies: config.proxies };
        const countryInfo = parseCountries(resultConfig, landing);
        const lowCostNodes = parseLowCost(resultConfig);
        const countryGroupNames = getCountryGroupNames(countryInfo, countryThreshold);
        const countries = stripNodeSuffix(countryGroupNames);
        const { landingNodes, nonLandingNodes } = landing ? parseNodesByLanding(resultConfig) : { landingNodes: [], nonLandingNodes: [] };
        const {
          defaultProxies,
          defaultProxiesDirect,
          defaultSelector,
          defaultFallback,
          frontProxySelector
        } = buildBaseLists({
          landing,
          lowCostNodes,
          countryGroupNames,
          nonLandingNodes,
          regexFilter
        });
        const countryProxyGroups = buildCountryProxyGroups({
          countries,
          landing,
          loadBalance,
          regexFilter,
          countryInfo
        });
        const proxyGroups = buildProxyGroups({
          landing,
          regexFilter,
          countries,
          countryProxyGroups,
          lowCostNodes,
          landingNodes,
          defaultProxies,
          defaultProxiesDirect,
          defaultSelector,
          defaultFallback,
          frontProxySelector
        });
        const globalProxies = proxyGroups.map((item) => String(item.name));
        proxyGroups.push({
          name: PROXY_GROUPS.GLOBAL,
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Global.png`,
          "include-all": true,
          type: "select",
          proxies: globalProxies
        });
        const finalRules = buildRules({ quicEnabled });
        if (fullConfig) {
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
              "store-selected": true
            }
          });
        }
        Object.assign(resultConfig, {
          "proxy-groups": proxyGroups,
          "rule-providers": ruleProviders,
          rules: finalRules,
          sniffer: snifferConfig,
          dns: buildDns({ fakeIPEnabled, ipv6Enabled }),
          "geodata-mode": true,
          "geox-url": geoxURL
        });
        return resultConfig;
      }
      globalThis.main = main;
    }
  });
  require_main();
})();
