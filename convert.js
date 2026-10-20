/*!
powerfullz 的 Substore 订阅转换脚本
https://github.com/powerfullz/override-rules

支持的传入参数：
- grouptype: 地区代理组类型（0=select 手动选择, 1=url-test 自动测速, 2=load-balance 负载均衡，默认 1）
  - 向后兼容：若未传 grouptype 但传了 loadbalance，则 loadbalance=true 映射为 grouptype=2，loadbalance=false 映射为 grouptype=1
- landing: 自动检测带 `dialer-proxy` 字段的节点，无需用户传参
- ipv6: 启用 IPv6 支持（默认 false）
- tun: 启用 TUN 模式（默认 false）
- full: 输出完整配置（适合纯内核启动，默认 false）
- keepalive: 启用 tcp-keep-alive（默认 false）
- fakeip: DNS 使用 FakeIP 模式（默认 true；传 false 时为 RedirHost）
- quic: 允许 QUIC 流量（UDP 443，默认 false）
- threshold: 地区节点数量小于该值时不显示分组（默认 2）
- regex: 使用正则过滤模式（include-all + filter）写入各地区代理组，而非直接枚举节点名称（默认 false）

源码位于 `src/`，入口为 `src/main.ts`。
*/
"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // src/utils/primitives.ts
  function parseBool(value, defaultValue = false) {
    if (typeof value === "undefined") return defaultValue;
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
  function isNotNull(value) {
    return value !== null;
  }
  var init_primitives = __esm({
    "src/utils/primitives.ts"() {
      "use strict";
    }
  });

  // src/args/schema.ts
  var ARG_DEFAULTS;
  var init_schema = __esm({
    "src/args/schema.ts"() {
      "use strict";
      ARG_DEFAULTS = {
        /** 地区代理组类型：0=select，1=url-test，2=load-balance。 */
        groupType: 1,
        /** 地区节点数量小于该值时不生成地区组。 */
        countryThreshold: 2,
        /** 默认使用 fake-ip 增强模式。 */
        fakeIPEnabled: true
      };
    }
  });

  // src/args/parse.ts
  function parseGroupType(args) {
    const raw = parseNumber(args.grouptype, Number.NaN);
    if (raw === 0 || raw === 1 || raw === 2) return raw;
    if (typeof args.loadbalance !== "undefined") {
      return parseBool(args.loadbalance) ? 2 : 1;
    }
    return ARG_DEFAULTS.groupType;
  }
  function buildFeatureFlags(args) {
    return {
      groupType: parseGroupType(args),
      ipv6Enabled: parseBool(args.ipv6),
      fullConfig: parseBool(args.full),
      keepAliveEnabled: parseBool(args.keepalive),
      fakeIPEnabled: parseBool(args.fakeip, ARG_DEFAULTS.fakeIPEnabled),
      quicEnabled: parseBool(args.quic),
      regexFilter: parseBool(args.regex),
      tunEnabled: parseBool(args.tun),
      countryThreshold: parseNumber(args.threshold, ARG_DEFAULTS.countryThreshold)
    };
  }
  var init_parse = __esm({
    "src/args/parse.ts"() {
      "use strict";
      init_primitives();
      init_schema();
    }
  });

  // src/catalog/endpoints.ts
  var CDN_URL, SPEEDTEST_URL;
  var init_endpoints = __esm({
    "src/catalog/endpoints.ts"() {
      "use strict";
      CDN_URL = "https://cdn.jsdelivr.net";
      SPEEDTEST_URL = "https://cp.cloudflare.com";
    }
  });

  // src/catalog/countries.ts
  var QURE, COUNTRY_KEYS, countriesMeta, countryRegexMap, countryExcludeRegexMap;
  var init_countries = __esm({
    "src/catalog/countries.ts"() {
      "use strict";
      init_endpoints();
      QURE = `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color`;
      COUNTRY_KEYS = {
        hongKong: "香港",
        taiwan: "台湾",
        unitedStates: "美国"
      };
      countriesMeta = {
        [COUNTRY_KEYS.hongKong]: {
          weight: 10,
          pattern: "香港|港|\\b(?:HK|hk)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Hong Kong|HongKong|hongkong|HONG KONG|HONGKONG|深港|HKG|九龙|Kowloon|新界|沙田|荃湾|葵涌|🇭🇰",
          icon: `${QURE}/Hong_Kong.png`
        },
        澳门: {
          pattern: "澳门|\\b(?:MO|mo)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Macau|🇲🇴",
          icon: `${QURE}/Macao.png`
        },
        [COUNTRY_KEYS.taiwan]: {
          weight: 20,
          pattern: "台|新北|彰化|\\b(?:TW|tw)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Taiwan|TAIWAN|TWN|TPE|ROC|🇹🇼|🇼🇸",
          icon: `${QURE}/Taiwan.png`
        },
        新加坡: {
          weight: 30,
          pattern: "新加坡|坡|狮城|\\b(?:SG|sg)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Singapore|SINGAPORE|SIN|🇸🇬",
          icon: `${QURE}/Singapore.png`
        },
        日本: {
          weight: 40,
          pattern: "日本|川日|东京|大阪|泉日|埼玉|沪日|深日|\\b(?:JP|jp)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Japan|JAPAN|JPN|NRT|HND|KIX|TYO|OSA|关西|Kansai|KANSAI|🇯🇵",
          icon: `${QURE}/Japan.png`
        },
        韩国: {
          weight: 45,
          pattern: "韩国|韩|韓|春川|Chuncheon|首尔|\\b(?:KR|kr)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Korea|KOREA|KOR|ICN|🇰🇷",
          icon: `${QURE}/Korea.png`
        },
        [COUNTRY_KEYS.unitedStates]: {
          weight: 50,
          pattern: "美国|美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|纽约|亚特兰大|迈阿密|华盛顿|\\b(?:US|us)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|United States|UnitedStates|UNITED STATES|USA|America|AMERICA|JFK|EWR|IAD|ATL|ORD|MIA|NYC|LAX|SFO|SEA|DFW|SJC|🇺🇸",
          icon: `${QURE}/United_States.png`,
          excludePattern: "美属|亚美尼亚|圣多美|普林西比"
        },
        加拿大: {
          weight: 55,
          pattern: "加拿大|渥太华|温哥华|卡尔加里|蒙特利尔|Montreal|\\b(?:CA|ca)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Canada|CANADA|CAN|YVR|YYZ|YUL|🇨🇦",
          icon: `${QURE}/Canada.png`
        },
        英国: {
          weight: 60,
          pattern: "英国|伦敦|曼彻斯特|Manchester|\\b(?:UK|uk)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Britain|United Kingdom|UNITED KINGDOM|England|GBR|LHR|MAN|🇬🇧",
          icon: `${QURE}/United_Kingdom.png`
        },
        澳大利亚: {
          pattern: "澳洲|澳大利亚|\\b(?:AU|au)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Australia|🇦🇺",
          icon: `${QURE}/Australia.png`
        },
        德国: {
          weight: 70,
          pattern: "德国|德|柏林|法兰克福|慕尼黑|Munich|\\b(?:DE|de)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Germany|GERMANY|DEU|MUC|🇩🇪",
          icon: `${QURE}/Germany.png`,
          excludePattern: "瓜德罗普"
        },
        法国: {
          weight: 80,
          pattern: "法国|法|巴黎|马赛|Marseille|\\b(?:FR|fr)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|France|FRANCE|FRA|CDG|MRS|🇫🇷",
          icon: `${QURE}/France.png`,
          excludePattern: "法属|布基纳法索|法罗"
        },
        俄罗斯: {
          pattern: "俄罗斯|俄|\\b(?:RU|ru)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Russia|🇷🇺",
          icon: `${QURE}/Russia.png`,
          excludePattern: "埃塞俄比亚|白俄罗斯"
        },
        泰国: {
          pattern: "泰国|泰|\\b(?:TH|th)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Thailand|🇹🇭",
          icon: `${QURE}/Thailand.png`,
          excludePattern: "巴泰"
        },
        印度: {
          pattern: "印度|\\b(?:IN|in)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|India|🇮🇳",
          icon: `${QURE}/India.png`,
          excludePattern: "印度洋"
        },
        马来西亚: {
          pattern: "马来西亚|马来|\\b(?:MY|my)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Malaysia|🇲🇾",
          icon: `${QURE}/Malaysia.png`
        },
        阿根廷: {
          pattern: "阿根廷|布宜诺斯艾利斯|\\b(?:AR|ar)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Argentina|EZE|🇦🇷",
          icon: `${QURE}/Argentina.png`
        },
        芬兰: {
          pattern: "芬兰|赫尔辛基|\\b(?:FI|fi)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Finland|HEL|🇫🇮",
          icon: `${QURE}/Finland.png`
        },
        埃及: {
          pattern: "埃及|开罗|\\b(?:EG|eg)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Egypt|CAI|🇪🇬",
          icon: `${QURE}/Egypt.png`
        },
        菲律宾: {
          pattern: "菲律宾|马尼拉|\\b(?:PH|ph)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Philippines|MNL|🇵🇭",
          icon: `${QURE}/Philippines.png`
        },
        土耳其: {
          pattern: "土耳其|伊斯坦布尔|\\b(?:TR|tr)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Turkey|Türkiye|IST|🇹🇷",
          icon: `${QURE}/Turkey.png`
        },
        乌克兰: {
          pattern: "乌克兰|基辅|\\b(?:UA|ua)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Ukraine|KBP|🇺🇦",
          icon: `${QURE}/Ukraine.png`
        }
      };
      countryRegexMap = Object.fromEntries(
        Object.entries(countriesMeta).map(([country, meta]) => [country, new RegExp(meta.pattern)])
      );
      countryExcludeRegexMap = Object.fromEntries(
        Object.entries(countriesMeta).filter(([, meta]) => meta.excludePattern).map(([country, meta]) => [country, new RegExp(meta.excludePattern)])
      );
    }
  });

  // src/catalog/group-names.ts
  function countryGroupName(country) {
    return `${country}${NODE_SUFFIX}`;
  }
  var NODE_SUFFIX, PROXY_GROUPS;
  var init_group_names = __esm({
    "src/catalog/group-names.ts"() {
      "use strict";
      NODE_SUFFIX = "节点";
      PROXY_GROUPS = {
        SELECT: "选择代理",
        MANUAL: "手动选择",
        AUTO: "自动选择",
        FALLBACK: "故障转移",
        LANDING: "落地节点",
        LOW_COST: "低倍率节点",
        FRONT_PROXY: "前置代理",
        STATIC_RESOURCES: "静态资源",
        AI_SERVICE: "AI服务",
        CRYPTO: "加密货币",
        FINANCE: "金融服务",
        APPLE: "苹果服务",
        GOOGLE: "谷歌服务",
        MICROSOFT: "微软服务",
        BILIBILI: "哔哩哔哩",
        BAHAMUT: "巴哈姆特",
        XBOX: "Xbox",
        TAILSCALE: "Tailscale",
        GITHUB: "Github",
        YOUTUBE: "Youtube",
        NETFLIX: "Netflix",
        TIKTOK: "TikTok",
        SPOTIFY: "Spotify",
        EHENTAI: "E-Hentai",
        TELEGRAM: "Telegram",
        TRUTH_SOCIAL: "Truth Social",
        TWITTER: "Twitter",
        TWITCH: "Twitch",
        WEIBO: "新浪微博",
        PIKPAK: "PikPak网盘",
        SOGOU_INPUT: "搜狗输入法",
        AD_BLOCK: "广告拦截",
        GLOBAL: "GLOBAL",
        FINAL: "Final"
      };
    }
  });

  // src/utils/regex.ts
  function createCaseInsensitiveNodeMatcher(source) {
    return {
      source,
      regex: new RegExp(source, "i"),
      pattern: `(?i)${source}`
    };
  }
  var init_regex = __esm({
    "src/utils/regex.ts"() {
      "use strict";
    }
  });

  // src/catalog/low-cost.ts
  var LOW_COST_NODE_MATCHER;
  var init_low_cost = __esm({
    "src/catalog/low-cost.ts"() {
      "use strict";
      init_regex();
      LOW_COST_NODE_MATCHER = createCaseInsensitiveNodeMatcher(
        String.raw`0\.[0-5]|低倍率|省流|实验性`
      );
    }
  });

  // src/analysis/active-countries.ts
  function getActiveCountryNames(countryNodes, minCount) {
    return Object.entries(countryNodes).filter(([, nodes]) => nodes.length >= minCount).sort(([a], [b]) => {
      const wa = countriesMeta[a]?.weight ?? Infinity;
      const wb = countriesMeta[b]?.weight ?? Infinity;
      return wa - wb;
    }).map(([country]) => country);
  }
  var init_active_countries = __esm({
    "src/analysis/active-countries.ts"() {
      "use strict";
      init_countries();
    }
  });

  // src/analysis/classify.ts
  function splitByLanding(nodes) {
    const landingNodes = [];
    const nonLandingNodes = [];
    for (const node of nodes) {
      if (!node.name) continue;
      if (node["dialer-proxy"] === PROXY_GROUPS.FRONT_PROXY) {
        landingNodes.push(node);
      } else {
        nonLandingNodes.push(node);
      }
    }
    return { landingNodes, nonLandingNodes };
  }
  function collectCountries(nodes) {
    const countryNodes = /* @__PURE__ */ Object.create(null);
    for (const node of nodes) {
      const name = node.name || "";
      for (const [country, regex] of Object.entries(countryRegexMap)) {
        if (!regex.test(name)) continue;
        if (countryExcludeRegexMap[country]?.test(name)) continue;
        (countryNodes[country] ??= []).push(node);
        break;
      }
    }
    return countryNodes;
  }
  function collectLowCost(nodes) {
    return nodes.filter((node) => LOW_COST_NODE_MATCHER.regex.test(node.name || ""));
  }
  function collectTailscale(nodes) {
    return nodes.filter((node) => node.type === "tailscale");
  }
  function analyzeNodes(nodes, threshold) {
    const { landingNodes, nonLandingNodes } = splitByLanding(nodes);
    const landing = landingNodes.length > 0 && nonLandingNodes.length > 0;
    const scopedNodes = landing ? nonLandingNodes : nodes;
    const countryNodes = collectCountries(scopedNodes);
    const countryNames = getActiveCountryNames(countryNodes, threshold);
    const lowCostNodes = collectLowCost(scopedNodes);
    const tailscaleNodes = collectTailscale(nodes);
    return {
      allNodes: nodes,
      allNames: nodes.map((node) => node.name),
      landingNodes,
      nonLandingNodes,
      landing,
      countryNodes,
      countryNames,
      lowCostNodes,
      tailscaleNodes,
      hasTailscale: tailscaleNodes.length > 0
    };
  }
  var init_classify = __esm({
    "src/analysis/classify.ts"() {
      "use strict";
      init_countries();
      init_group_names();
      init_low_cost();
      init_active_countries();
    }
  });

  // src/builders/base-lists.ts
  function buildBaseLists({
    landing,
    lowCostNodes,
    countryNames,
    nonLandingNodes,
    regexFilter
  }) {
    const suffixedCountryNames = countryNames.map(countryGroupName);
    const hasLowCost = lowCostNodes.length > 0 || regexFilter;
    const defaultSelector = buildList(
      PROXY_GROUPS.AUTO,
      PROXY_GROUPS.FALLBACK,
      landing && PROXY_GROUPS.LANDING,
      suffixedCountryNames,
      hasLowCost && PROXY_GROUPS.LOW_COST,
      PROXY_GROUPS.MANUAL,
      "DIRECT"
    );
    const defaultProxies = buildList(
      PROXY_GROUPS.SELECT,
      landing && PROXY_GROUPS.LANDING,
      suffixedCountryNames,
      hasLowCost && PROXY_GROUPS.LOW_COST,
      PROXY_GROUPS.MANUAL,
      "DIRECT"
    );
    const defaultProxiesDirect = buildList(
      "DIRECT",
      landing && PROXY_GROUPS.LANDING,
      suffixedCountryNames,
      hasLowCost && PROXY_GROUPS.LOW_COST,
      PROXY_GROUPS.SELECT,
      PROXY_GROUPS.MANUAL
    );
    const defaultFallback = buildList(
      landing && PROXY_GROUPS.LANDING,
      suffixedCountryNames,
      PROXY_GROUPS.MANUAL,
      "DIRECT"
    );
    const frontProxySelector = buildList(
      suffixedCountryNames,
      "DIRECT",
      !regexFilter && nonLandingNodes.map((node) => node.name).filter(Boolean)
    );
    return {
      defaultProxies,
      defaultProxiesDirect,
      defaultSelector,
      defaultFallback,
      frontProxySelector
    };
  }
  var init_base_lists = __esm({
    "src/builders/base-lists.ts"() {
      "use strict";
      init_group_names();
      init_primitives();
    }
  });

  // src/catalog/icons.ts
  var QURE2, SELF, STASH, MINI, ICONS;
  var init_icons = __esm({
    "src/catalog/icons.ts"() {
      "use strict";
      init_endpoints();
      QURE2 = `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color`;
      SELF = `${CDN_URL}/gh/powerfullz/override-rules@master/icons`;
      STASH = `${CDN_URL}/gh/shindgewongxj/WHATSINStash@master/icon`;
      MINI = `${CDN_URL}/gh/Orz-3/mini@master/Color`;
      ICONS = {
        select: `${QURE2}/Proxy.png`,
        manual: `${STASH}/select.png`,
        frontProxy: `${QURE2}/Area.png`,
        landing: `${QURE2}/Airport.png`,
        staticResources: `${QURE2}/Cloudflare.png`,
        aiService: `${QURE2}/ChatGPT.png`,
        crypto: `${QURE2}/Cryptocurrency_1.png`,
        finance: `${SELF}/Nasdaq.png`,
        apple: `${QURE2}/Apple_2.png`,
        google: `${MINI}/Google.png`,
        microsoft: `${SELF}/Microsoft_Copilot.png`,
        xbox: `${QURE2}/Xbox.png`,
        github: `${QURE2}/GitHub.png`,
        bilibili: `${QURE2}/bilibili.png`,
        bahamut: `${QURE2}/Bahamut.png`,
        youtube: `${QURE2}/YouTube.png`,
        twitch: `${QURE2}/Twitch.png`,
        netflix: `${QURE2}/Netflix.png`,
        tiktok: `${QURE2}/TikTok.png`,
        spotify: `${QURE2}/Spotify.png`,
        telegram: `${SELF}/Telegram.png`,
        twitter: `${QURE2}/Twitter.png`,
        weibo: `${QURE2}/Weibo.png`,
        truthSocial: `${SELF}/Truth_Social.png`,
        ehentai: `${SELF}/Ehentai.png`,
        pikpak: `${SELF}/PikPak.png`,
        sogouInput: `${SELF}/Sougou.png`,
        tailscale: `${SELF}/Tailscale.png`,
        adBlock: `${QURE2}/AdBlack.png`,
        final: `${QURE2}/Final.png`,
        auto: `${QURE2}/Auto.png`,
        fallback: `${QURE2}/Available_1.png`,
        lowCost: `${QURE2}/Lab.png`,
        global: `${QURE2}/Global.png`
      };
    }
  });

  // src/catalog/rule-sets.ts
  function ruleSet(key, target) {
    return `RULE-SET,${key},${target}`;
  }
  var ruleSets;
  var init_rule_sets = __esm({
    "src/catalog/rule-sets.ts"() {
      "use strict";
      init_endpoints();
      ruleSets = {
        ADBlock: {
          type: "http",
          behavior: "domain",
          format: "yaml",
          interval: 86400,
          url: `${CDN_URL}/gh/217heidai/adblockfilters@main/rules/adblockmihomolite.yaml`,
          path: "./ruleset/ADBlock.yaml"
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
        Weibo: {
          type: "http",
          behavior: "classical",
          format: "text",
          interval: 86400,
          url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/Weibo.list`,
          path: "./ruleset/Weibo.list"
        },
        GFWList: {
          type: "http",
          behavior: "domain",
          format: "yaml",
          interval: 86400,
          url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
          path: "./ruleset/GFWList.yaml"
        }
      };
    }
  });

  // src/builders/dns.ts
  function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
  function getStringList(value) {
    return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : void 0;
  }
  function mergeStringLists(current, upstream) {
    const upstreamList = getStringList(upstream);
    if (!current && !upstreamList) return void 0;
    return [.../* @__PURE__ */ new Set([...current ?? [], ...upstreamList ?? []])];
  }
  function mergeDnsPolicies(current, upstream) {
    if (!isRecord(upstream)) return current;
    const upstreamPolicy = {};
    for (const [key, value] of Object.entries(upstream)) {
      if (typeof value === "string") {
        upstreamPolicy[key] = value;
      } else if (getStringList(value)) {
        upstreamPolicy[key] = value;
      }
    }
    return { ...current ?? {}, ...upstreamPolicy };
  }
  function inheritDnsFields(generated, upstream) {
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
  function buildDnsConfig({ mode, ipv6Enabled, fakeIpFilter }) {
    const config = {
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
        "tcp://8.26.56.2"
      ]
    };
    if (fakeIpFilter) {
      config["fake-ip-filter"] = fakeIpFilter;
    }
    return config;
  }
  function buildDns({ fakeIPEnabled, ipv6Enabled, upstreamDns }) {
    const generated = fakeIPEnabled ? buildDnsConfig({ mode: "fake-ip", ipv6Enabled, fakeIpFilter: FAKE_IP_FILTER }) : buildDnsConfig({ mode: "redir-host", ipv6Enabled });
    return inheritDnsFields(generated, upstreamDns);
  }
  var FAKE_IP_FILTER, DNS_POLICY_FIELDS;
  var init_dns = __esm({
    "src/builders/dns.ts"() {
      "use strict";
      FAKE_IP_FILTER = [
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
        "+.apt-agent.com"
      ];
      DNS_POLICY_FIELDS = ["nameserver-policy", "proxy-server-nameserver-policy"];
    }
  });

  // src/builders/full-config.ts
  function buildFullConfig(flags) {
    return {
      "mixed-port": 7890,
      "redir-port": 7892,
      "tproxy-port": 7893,
      "routing-mark": 7894,
      "allow-lan": true,
      "bind-address": "*",
      ipv6: flags.ipv6Enabled,
      mode: "rule",
      "unified-delay": true,
      "tcp-concurrent": true,
      "find-process-mode": "off",
      "log-level": "info",
      "geodata-loader": "standard",
      "external-controller": ":9999",
      "disable-keep-alive": !flags.keepAliveEnabled,
      profile: { "store-selected": true }
    };
  }
  var init_full_config = __esm({
    "src/builders/full-config.ts"() {
      "use strict";
    }
  });

  // src/builders/geox.ts
  var geoxUrl;
  var init_geox = __esm({
    "src/builders/geox.ts"() {
      "use strict";
      init_endpoints();
      geoxUrl = {
        geoip: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/geoip.dat`,
        geosite: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/geosite.dat`,
        mmdb: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/country.mmdb`,
        asn: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/GeoLite2-ASN.mmdb`
      };
    }
  });

  // src/builders/rules.ts
  function buildRules({ quicEnabled, hasTailscale }) {
    return [
      !quicEnabled ? `AND,((DST-PORT,443),(NETWORK,UDP)),REJECT` : null,
      hasTailscale ? `IP-CIDR,100.64.0.0/10,${PROXY_GROUPS.TAILSCALE},no-resolve` : null,
      hasTailscale ? `IP-CIDR,fd7a:115c:a1e0::/48,${PROXY_GROUPS.TAILSCALE},no-resolve` : null,
      hasTailscale ? `DOMAIN-SUFFIX,ts.net,${PROXY_GROUPS.TAILSCALE}` : null,
      `GEOIP,private,DIRECT,no-resolve`,
      ruleSet("ADBlock", PROXY_GROUPS.AD_BLOCK),
      ruleSet("AdditionalFilter", PROXY_GROUPS.AD_BLOCK),
      ruleSet("SogouInput", PROXY_GROUPS.SOGOU_INPUT),
      `DOMAIN-SUFFIX,truthsocial.com,${PROXY_GROUPS.TRUTH_SOCIAL}`,
      ruleSet("StaticResources", PROXY_GROUPS.STATIC_RESOURCES),
      ruleSet("CDNResources", PROXY_GROUPS.STATIC_RESOURCES),
      ruleSet("AdditionalCDNResources", PROXY_GROUPS.STATIC_RESOURCES),
      `GEOSITE,category-cryptocurrency,${PROXY_GROUPS.CRYPTO}`,
      `GEOSITE,category-finance,${PROXY_GROUPS.FINANCE}`,
      `GEOSITE,category-ai-!cn,${PROXY_GROUPS.AI_SERVICE}`,
      `GEOSITE,bilibili,${PROXY_GROUPS.BILIBILI}`,
      `GEOSITE,youtube,${PROXY_GROUPS.YOUTUBE}`,
      `GEOSITE,telegram,${PROXY_GROUPS.TELEGRAM}`,
      `GEOIP,telegram,${PROXY_GROUPS.TELEGRAM},no-resolve`,
      `GEOSITE,xbox,${PROXY_GROUPS.XBOX}`,
      `GEOSITE,github,${PROXY_GROUPS.GITHUB}`,
      `GEOSITE,netflix,${PROXY_GROUPS.NETFLIX}`,
      `GEOSITE,twitch,${PROXY_GROUPS.TWITCH}`,
      `GEOIP,netflix,${PROXY_GROUPS.NETFLIX},no-resolve`,
      `GEOSITE,spotify,${PROXY_GROUPS.SPOTIFY}`,
      `GEOSITE,bahamut,${PROXY_GROUPS.BAHAMUT}`,
      `GEOSITE,pikpak,${PROXY_GROUPS.PIKPAK}`,
      `GEOSITE,twitter,${PROXY_GROUPS.TWITTER}`,
      ruleSet("Weibo", PROXY_GROUPS.WEIBO),
      ruleSet("EHentai", PROXY_GROUPS.EHENTAI),
      ruleSet("TikTok", PROXY_GROUPS.TIKTOK),
      ruleSet("SteamFix", "DIRECT"),
      ruleSet("GoogleFCM", "DIRECT"),
      `GEOSITE,google-play@cn,DIRECT`,
      `GEOSITE,microsoft@cn,DIRECT`,
      `GEOSITE,apple,${PROXY_GROUPS.APPLE}`,
      `GEOSITE,microsoft,${PROXY_GROUPS.MICROSOFT}`,
      `GEOSITE,google,${PROXY_GROUPS.GOOGLE}`,
      ruleSet("GFWList", PROXY_GROUPS.SELECT),
      `GEOIP,cn,DIRECT`,
      `MATCH,${PROXY_GROUPS.FINAL}`
    ].filter(isNotNull);
  }
  var init_rules = __esm({
    "src/builders/rules.ts"() {
      "use strict";
      init_group_names();
      init_rule_sets();
      init_primitives();
    }
  });

  // src/builders/sniffer.ts
  var snifferConfig;
  var init_sniffer = __esm({
    "src/builders/sniffer.ts"() {
      "use strict";
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

  // src/builders/tun.ts
  function buildTunConfig(tunEnabled, hasTailscale) {
    return {
      enable: tunEnabled,
      stack: "gvisor",
      device: "mihomo",
      "route-exclude-address": [
        !hasTailscale ? "100.64.0.0/10" : null,
        !hasTailscale ? "fd7a:115c:a1e0::/48" : null,
        "192.168.0.0/16"
      ].filter(isNotNull),
      "dns-hijack": ["any:53"],
      mtu: 1500
    };
  }
  var init_tun = __esm({
    "src/builders/tun.ts"() {
      "use strict";
      init_primitives();
    }
  });

  // src/builders/config.ts
  function appendGlobalGroup(groups) {
    const global = {
      name: PROXY_GROUPS.GLOBAL,
      icon: ICONS.global,
      "include-all": true,
      type: "select",
      proxies: groups.map((group) => String(group.name))
    };
    return [...groups, global];
  }
  function assembleConfig(config, { flags, nodes, proxyGroups }) {
    return {
      proxies: config.proxies,
      ...config.hosts !== void 0 && { hosts: config.hosts },
      ...flags.fullConfig && buildFullConfig(flags),
      "proxy-groups": appendGlobalGroup(proxyGroups),
      "rule-providers": ruleSets,
      rules: buildRules({ quicEnabled: flags.quicEnabled, hasTailscale: nodes.hasTailscale }),
      sniffer: snifferConfig,
      dns: buildDns({
        fakeIPEnabled: flags.fakeIPEnabled,
        ipv6Enabled: flags.ipv6Enabled,
        upstreamDns: config.dns
      }),
      tun: buildTunConfig(flags.tunEnabled, nodes.hasTailscale),
      "geodata-mode": true,
      "geox-url": geoxUrl
    };
  }
  var init_config = __esm({
    "src/builders/config.ts"() {
      "use strict";
      init_group_names();
      init_icons();
      init_rule_sets();
      init_dns();
      init_full_config();
      init_geox();
      init_rules();
      init_sniffer();
      init_tun();
    }
  });

  // src/catalog/service-groups.ts
  var serviceGroups;
  var init_service_groups = __esm({
    "src/catalog/service-groups.ts"() {
      "use strict";
      init_countries();
      init_group_names();
      init_icons();
      serviceGroups = [
        {
          name: PROXY_GROUPS.STATIC_RESOURCES,
          icon: ICONS.staticResources,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.AI_SERVICE,
          icon: ICONS.aiService,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.CRYPTO,
          icon: ICONS.crypto,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.FINANCE,
          icon: ICONS.finance,
          proxies: (ctx) => ctx.lists.defaultProxiesDirect
        },
        {
          name: PROXY_GROUPS.APPLE,
          icon: ICONS.apple,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.GOOGLE,
          icon: ICONS.google,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.MICROSOFT,
          icon: ICONS.microsoft,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.XBOX,
          icon: ICONS.xbox,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.GITHUB,
          icon: ICONS.github,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.BILIBILI,
          icon: ICONS.bilibili,
          proxies: (ctx) => ctx.nodes.countryNames.includes(COUNTRY_KEYS.taiwan) && ctx.nodes.countryNames.includes(COUNTRY_KEYS.hongKong) ? [
            "DIRECT",
            countryGroupName(COUNTRY_KEYS.taiwan),
            countryGroupName(COUNTRY_KEYS.hongKong)
          ] : ctx.lists.defaultProxiesDirect
        },
        {
          name: PROXY_GROUPS.BAHAMUT,
          icon: ICONS.bahamut,
          proxies: (ctx) => ctx.nodes.countryNames.includes(COUNTRY_KEYS.taiwan) ? [
            countryGroupName(COUNTRY_KEYS.taiwan),
            PROXY_GROUPS.SELECT,
            PROXY_GROUPS.MANUAL,
            "DIRECT"
          ] : ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.YOUTUBE,
          icon: ICONS.youtube,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.TWITCH,
          icon: ICONS.twitch,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.NETFLIX,
          icon: ICONS.netflix,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.TIKTOK,
          icon: ICONS.tiktok,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.SPOTIFY,
          icon: ICONS.spotify,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.TELEGRAM,
          icon: ICONS.telegram,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.TWITTER,
          icon: ICONS.twitter,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.WEIBO,
          icon: ICONS.weibo,
          includeAll: true,
          proxies: (ctx) => ctx.lists.defaultProxiesDirect
        },
        {
          name: PROXY_GROUPS.TRUTH_SOCIAL,
          icon: ICONS.truthSocial,
          proxies: (ctx) => ctx.nodes.countryNames.includes(COUNTRY_KEYS.unitedStates) ? [
            countryGroupName(COUNTRY_KEYS.unitedStates),
            PROXY_GROUPS.SELECT,
            PROXY_GROUPS.MANUAL
          ] : ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.EHENTAI,
          icon: ICONS.ehentai,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.PIKPAK,
          icon: ICONS.pikpak,
          proxies: (ctx) => ctx.lists.defaultProxies
        },
        {
          name: PROXY_GROUPS.SOGOU_INPUT,
          icon: ICONS.sogouInput,
          proxies: () => ["DIRECT", "REJECT"]
        }
      ];
    }
  });

  // src/domain/proxy-group.ts
  function buildGroupByType({
    name,
    icon,
    groupType,
    nodeSource
  }) {
    switch (groupType) {
      case 0:
        return { name, icon, type: "select", ...nodeSource };
      case 1:
        return {
          name,
          icon,
          type: "url-test",
          url: SPEEDTEST_URL,
          interval: 60,
          tolerance: 20,
          ...nodeSource
        };
      case 2:
        return {
          name,
          icon,
          type: "load-balance",
          strategy: "sticky-sessions",
          url: SPEEDTEST_URL,
          interval: 60,
          tolerance: 20,
          ...nodeSource
        };
    }
  }
  function selectGroup(name, icon, proxies, includeAll = false) {
    return {
      name,
      icon,
      type: "select",
      ...includeAll ? { "include-all": true } : {},
      proxies
    };
  }
  function urlTestGroup(name, icon, proxies) {
    return {
      name,
      icon,
      type: "url-test",
      url: SPEEDTEST_URL,
      proxies,
      interval: 60,
      tolerance: 20
    };
  }
  function fallbackGroup(name, icon, proxies) {
    return {
      name,
      icon,
      type: "fallback",
      url: SPEEDTEST_URL,
      proxies,
      interval: 60,
      tolerance: 20
    };
  }
  var init_proxy_group = __esm({
    "src/domain/proxy-group.ts"() {
      "use strict";
      init_endpoints();
    }
  });

  // src/builders/proxy-groups.ts
  function buildFrontGroups(ctx) {
    return [
      selectGroup(PROXY_GROUPS.SELECT, ICONS.select, ctx.lists.defaultSelector),
      selectGroup(PROXY_GROUPS.MANUAL, ICONS.manual, ctx.nodes.allNames),
      ctx.nodes.landing ? selectGroup(PROXY_GROUPS.FRONT_PROXY, ICONS.frontProxy, ctx.lists.frontProxySelector) : null,
      ctx.nodes.landing ? selectGroup(
        PROXY_GROUPS.LANDING,
        ICONS.landing,
        ctx.nodes.landingNodes.map((node) => node.name)
      ) : null
    ];
  }
  function buildServiceGroups(ctx) {
    return serviceGroups.map(
      (def) => selectGroup(def.name, def.icon, def.proxies(ctx), def.includeAll)
    );
  }
  function buildTailGroups(ctx) {
    return [
      ctx.nodes.hasTailscale ? selectGroup(
        PROXY_GROUPS.TAILSCALE,
        ICONS.tailscale,
        ctx.nodes.tailscaleNodes.map((node) => node.name)
      ) : null,
      selectGroup(PROXY_GROUPS.AD_BLOCK, ICONS.adBlock, ["REJECT", "REJECT-DROP", "DIRECT"]),
      selectGroup(PROXY_GROUPS.FINAL, ICONS.final, [PROXY_GROUPS.SELECT, "DIRECT"]),
      urlTestGroup(PROXY_GROUPS.AUTO, ICONS.auto, ctx.lists.defaultFallback),
      fallbackGroup(PROXY_GROUPS.FALLBACK, ICONS.fallback, ctx.lists.defaultFallback)
    ];
  }
  function buildRegionGroups(ctx) {
    const { flags, nodes } = ctx;
    const hasLowCost = nodes.lowCostNodes.length > 0 || flags.regexFilter;
    const lowCostGroup = hasLowCost ? buildGroupByType({
      name: PROXY_GROUPS.LOW_COST,
      icon: ICONS.lowCost,
      groupType: flags.groupType,
      nodeSource: !flags.regexFilter ? { proxies: nodes.lowCostNodes.map((node) => node.name) } : { "include-all": true, filter: LOW_COST_NODE_MATCHER.pattern }
    }) : null;
    const countryGroups = nodes.countryNames.map((country) => {
      const meta = countriesMeta[country];
      if (!meta) return null;
      const nodeSource = flags.regexFilter ? {
        "include-all": true,
        filter: meta.pattern,
        ...meta.excludePattern ? { "exclude-filter": meta.excludePattern } : {}
      } : { proxies: nodes.countryNodes[country]?.map((node) => node.name) };
      return buildGroupByType({
        name: countryGroupName(country),
        icon: meta.icon,
        groupType: flags.groupType,
        nodeSource
      });
    });
    return [lowCostGroup, ...countryGroups];
  }
  function buildProxyGroups(ctx) {
    const groups = [
      ...buildFrontGroups(ctx),
      ...buildServiceGroups(ctx),
      ...buildTailGroups(ctx),
      ...buildRegionGroups(ctx)
    ];
    return groups.filter(isNotNull);
  }
  var init_proxy_groups = __esm({
    "src/builders/proxy-groups.ts"() {
      "use strict";
      init_countries();
      init_group_names();
      init_icons();
      init_low_cost();
      init_service_groups();
      init_proxy_group();
      init_primitives();
    }
  });

  // src/main.ts
  var require_main = __commonJS({
    "src/main.ts"() {
      init_parse();
      init_classify();
      init_base_lists();
      init_config();
      init_proxy_groups();
      function readRawArgs() {
        try {
          return $arguments;
        } catch {
          return {};
        }
      }
      function main(config) {
        if (!config.proxies || !Array.isArray(config.proxies)) {
          throw new Error("[powerfullz 的覆写脚本] 错误：Clash 配置中缺少有效的 proxies 字段");
        }
        const flags = buildFeatureFlags(readRawArgs());
        const nodes = analyzeNodes(config.proxies, flags.countryThreshold);
        const lists = buildBaseLists({
          landing: nodes.landing,
          lowCostNodes: nodes.lowCostNodes,
          countryNames: nodes.countryNames,
          nonLandingNodes: nodes.nonLandingNodes,
          regexFilter: flags.regexFilter
        });
        const proxyGroups = buildProxyGroups({ flags, nodes, lists });
        return assembleConfig(config, { flags, nodes, proxyGroups });
      }
      globalThis.main = main;
    }
  });
  require_main();
})();
