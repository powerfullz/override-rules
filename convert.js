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

  // src/constants.ts
  var NODE_SUFFIX, CDN_URL, LOW_COST_FILTER, LOW_COST_GROUP_PATTERN, LOW_COST_REGEX, LANDING_REGEX, LANDING_PATTERN, FEATURE_FLAG_DEFAULTS, PROXY_GROUPS, ruleProviders, baseRules, snifferConfig, FAKE_IP_FILTER, geoxURL, countriesMeta;
  var init_constants = __esm({
    "src/constants.ts"() {
      "use strict";
      NODE_SUFFIX = "\u8282\u70B9";
      CDN_URL = "https://gcore.jsdelivr.net";
      LOW_COST_FILTER = "0\\.[0-5]|\u4F4E\u500D\u7387|\u7701\u6D41|\u5B9E\u9A8C\u6027";
      LOW_COST_GROUP_PATTERN = "(?i)0\\.[0-5]|\u4F4E\u500D\u7387|\u7701\u6D41|\u5927\u6D41\u91CF|\u5B9E\u9A8C\u6027";
      LOW_COST_REGEX = new RegExp(LOW_COST_FILTER, "i");
      LANDING_REGEX = /家宽|家庭宽带|商宽|商业宽带|星链|Starlink|落地/i;
      LANDING_PATTERN = "(?i)\u5BB6\u5BBD|\u5BB6\u5EAD\u5BBD\u5E26|\u5546\u5BBD|\u5546\u4E1A\u5BBD\u5E26|\u661F\u94FE|Starlink|\u843D\u5730";
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
      PROXY_GROUPS = {
        SELECT: "\u9009\u62E9\u4EE3\u7406",
        MANUAL: "\u624B\u52A8\u9009\u62E9",
        AUTO: "\u81EA\u52A8\u9009\u62E9",
        FALLBACK: "\u6545\u969C\u8F6C\u79FB",
        DIRECT: "\u76F4\u8FDE",
        LANDING: "\u843D\u5730\u8282\u70B9",
        LOW_COST: "\u4F4E\u500D\u7387\u8282\u70B9",
        FRONT_PROXY: "\u524D\u7F6E\u4EE3\u7406",
        STATIC_RESOURCES: "\u9759\u6001\u8D44\u6E90",
        AI_SERVICE: "AI\u670D\u52A1",
        CRYPTO: "\u52A0\u5BC6\u8D27\u5E01",
        APPLE: "\u82F9\u679C\u670D\u52A1",
        GOOGLE: "\u8C37\u6B4C\u670D\u52A1",
        MICROSOFT: "\u5FAE\u8F6F\u670D\u52A1",
        BILIBILI: "\u54D4\u54E9\u54D4\u54E9",
        BAHAMUT: "\u5DF4\u54C8\u59C6\u7279",
        YOUTUBE: "YouTube",
        NETFLIX: "Netflix",
        TIKTOK: "TikTok",
        SPOTIFY: "Spotify",
        EHENTAI: "E-Hentai",
        TELEGRAM: "Telegram",
        TRUTH_SOCIAL: "\u771F\u76F8\u793E\u4EA4",
        PIKPAK: "PikPak\u7F51\u76D8",
        SSH: "SSH(22\u7AEF\u53E3)",
        SOGOU_INPUT: "\u641C\u72D7\u8F93\u5165\u6CD5",
        AD_BLOCK: "\u5E7F\u544A\u62E6\u622A",
        GLOBAL: "GLOBAL"
      };
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
        }
      };
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
        `GEOSITE,YOUTUBE,${PROXY_GROUPS.YOUTUBE}`,
        `GEOSITE,TELEGRAM,${PROXY_GROUPS.TELEGRAM}`,
        `GEOSITE,CATEGORY-AI-!CN,${PROXY_GROUPS.AI_SERVICE}`,
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
      geoxURL = {
        geoip: `${CDN_URL}/gh/Loyalsoldier/v2ray-rules-dat@release/geoip.dat`,
        geosite: `${CDN_URL}/gh/Loyalsoldier/v2ray-rules-dat@release/geosite.dat`,
        mmdb: `${CDN_URL}/gh/Loyalsoldier/geoip@release/Country.mmdb`,
        asn: `${CDN_URL}/gh/Loyalsoldier/geoip@release/GeoLite2-ASN.mmdb`
      };
      countriesMeta = {
        \u9999\u6E2F: {
          weight: 10,
          pattern: "\u9999\u6E2F|\u6E2F|HK|hk|Hong Kong|HongKong|hongkong|\u{1F1ED}\u{1F1F0}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png`
        },
        \u6FB3\u95E8: {
          pattern: "\u6FB3\u95E8|MO|Macau|\u{1F1F2}\u{1F1F4}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Macao.png`
        },
        \u53F0\u6E7E: {
          weight: 20,
          pattern: "\u53F0|\u65B0\u5317|\u5F70\u5316|TW|Taiwan|\u{1F1F9}\u{1F1FC}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png`
        },
        \u65B0\u52A0\u5761: {
          weight: 30,
          pattern: "\u65B0\u52A0\u5761|\u5761|\u72EE\u57CE|SG|Singapore|\u{1F1F8}\u{1F1EC}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Singapore.png`
        },
        \u65E5\u672C: {
          weight: 40,
          pattern: "\u65E5\u672C|\u5DDD\u65E5|\u4E1C\u4EAC|\u5927\u962A|\u6CC9\u65E5|\u57FC\u7389|\u6CAA\u65E5|\u6DF1\u65E5|JP|Japan|\u{1F1EF}\u{1F1F5}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Japan.png`
        },
        \u97E9\u56FD: {
          pattern: "KR|Korea|KOR|\u9996\u5C14|\u97E9|\u97D3|\u{1F1F0}\u{1F1F7}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Korea.png`
        },
        \u7F8E\u56FD: {
          weight: 50,
          pattern: "\u7F8E\u56FD|\u7F8E|US|United States|\u{1F1FA}\u{1F1F8}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/United_States.png`
        },
        \u52A0\u62FF\u5927: {
          pattern: "\u52A0\u62FF\u5927|Canada|CA|\u{1F1E8}\u{1F1E6}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Canada.png`
        },
        \u82F1\u56FD: {
          weight: 60,
          pattern: "\u82F1\u56FD|United Kingdom|UK|\u4F26\u6566|London|\u{1F1EC}\u{1F1E7}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/United_Kingdom.png`
        },
        \u6FB3\u5927\u5229\u4E9A: {
          pattern: "\u6FB3\u6D32|\u6FB3\u5927\u5229\u4E9A|AU|Australia|\u{1F1E6}\u{1F1FA}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Australia.png`
        },
        \u5FB7\u56FD: {
          weight: 70,
          pattern: "\u5FB7\u56FD|\u5FB7|DE|Germany|\u{1F1E9}\u{1F1EA}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Germany.png`
        },
        \u6CD5\u56FD: {
          weight: 80,
          pattern: "\u6CD5\u56FD|\u6CD5|FR|France|\u{1F1EB}\u{1F1F7}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/France.png`
        },
        \u4FC4\u7F57\u65AF: {
          pattern: "\u4FC4\u7F57\u65AF|\u4FC4|RU|Russia|\u{1F1F7}\u{1F1FA}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Russia.png`
        },
        \u6CF0\u56FD: {
          pattern: "\u6CF0\u56FD|\u6CF0|TH|Thailand|\u{1F1F9}\u{1F1ED}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Thailand.png`
        },
        \u5370\u5EA6: {
          pattern: "\u5370\u5EA6|IN|India|\u{1F1EE}\u{1F1F3}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/India.png`
        },
        \u9A6C\u6765\u897F\u4E9A: {
          pattern: "\u9A6C\u6765\u897F\u4E9A|\u9A6C\u6765|MY|Malaysia|\u{1F1F2}\u{1F1FE}",
          icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Malaysia.png`
        }
      };
    }
  });

  // src/args.ts
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
  var init_args = __esm({
    "src/args.ts"() {
      "use strict";
      init_constants();
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
      let groupConfig;
      if (!regexFilter) {
        const nodeNames = nodesByCountry?.[country] || [];
        groupConfig = {
          name: `${country}${NODE_SUFFIX}`,
          icon: meta.icon,
          type: groupType,
          proxies: nodeNames
        };
      } else {
        groupConfig = {
          name: `${country}${NODE_SUFFIX}`,
          icon: meta.icon,
          "include-all": true,
          filter: meta.pattern,
          "exclude-filter": landing ? `${LANDING_PATTERN}|${LOW_COST_FILTER}` : LOW_COST_FILTER,
          type: groupType
        };
      }
      if (!loadBalance) {
        Object.assign(groupConfig, {
          url: "https://cp.cloudflare.com/generate_204",
          interval: 60,
          tolerance: 20,
          lazy: false
        });
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
    const hasTW = countries.includes("\u53F0\u6E7E");
    const hasHK = countries.includes("\u9999\u6E2F");
    const hasUS = countries.includes("\u7F8E\u56FD");
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
          "exclude-filter": LANDING_PATTERN,
          proxies: frontProxySelector
        } : { proxies: frontProxySelector }
      } : null,
      landing ? {
        name: PROXY_GROUPS.LANDING,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Airport.png`,
        type: "select",
        ...regexFilter ? { "include-all": true, filter: LANDING_PATTERN } : { proxies: landingNodes }
      } : null,
      {
        name: PROXY_GROUPS.STATIC_RESOURCES,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Cloudflare.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.AI_SERVICE,
        icon: `${CDN_URL}/gh/powerfullz/override-rules@master/icons/chatgpt.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.CRYPTO,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Cryptocurrency_3.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.APPLE,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Apple.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.GOOGLE,
        icon: `${CDN_URL}/gh/powerfullz/override-rules@master/icons/Google.png`,
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
        proxies: hasTW && hasHK ? [PROXY_GROUPS.DIRECT, "\u53F0\u6E7E\u8282\u70B9", "\u9999\u6E2F\u8282\u70B9"] : defaultProxiesDirect
      },
      {
        name: PROXY_GROUPS.BAHAMUT,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Bahamut.png`,
        type: "select",
        proxies: hasTW ? ["\u53F0\u6E7E\u8282\u70B9", PROXY_GROUPS.SELECT, PROXY_GROUPS.MANUAL, PROXY_GROUPS.DIRECT] : defaultProxies
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
        name: PROXY_GROUPS.EHENTAI,
        icon: `${CDN_URL}/gh/powerfullz/override-rules@master/icons/Ehentai.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.TELEGRAM,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Telegram.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.TRUTH_SOCIAL,
        icon: `${CDN_URL}/gh/powerfullz/override-rules@master/icons/TruthSocial.png`,
        type: "select",
        proxies: hasUS ? ["\u7F8E\u56FD\u8282\u70B9", PROXY_GROUPS.SELECT, PROXY_GROUPS.MANUAL] : defaultProxies
      },
      {
        name: PROXY_GROUPS.PIKPAK,
        icon: `${CDN_URL}/gh/powerfullz/override-rules@master/icons/PikPak.png`,
        type: "select",
        proxies: defaultProxies
      },
      {
        name: PROXY_GROUPS.SSH,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Server.png`,
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
        ...!regexFilter ? { proxies: lowCostNodes } : { "include-all": true, filter: LOW_COST_GROUP_PATTERN }
      } : null,
      {
        name: PROXY_GROUPS.AUTO,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Auto.png`,
        type: "url-test",
        url: "https://cp.cloudflare.com/generate_204",
        proxies: defaultFallback,
        interval: 60,
        tolerance: 20,
        lazy: false
      },
      {
        name: PROXY_GROUPS.FALLBACK,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Available_1.png`,
        type: "fallback",
        url: "https://cp.cloudflare.com/generate_204",
        proxies: defaultFallback,
        interval: 60,
        tolerance: 20,
        lazy: false
      },
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

  // src/proxy_parser.ts
  function parseLowCost(config) {
    return (config.proxies || []).filter((proxy) => LOW_COST_REGEX.test(proxy.name || "")).map((proxy) => proxy.name).filter((name) => Boolean(name));
  }
  function parseNodesByLanding(config) {
    const landingNodes = [];
    const nonLandingNodes = [];
    for (const proxy of config.proxies || []) {
      const name = proxy.name;
      if (!name) continue;
      if (LANDING_REGEX.test(name)) {
        landingNodes.push(name);
        continue;
      }
      nonLandingNodes.push(name);
    }
    return { landingNodes, nonLandingNodes };
  }
  function parseCountries(config) {
    const proxies = config.proxies || [];
    const countryNodes = /* @__PURE__ */ Object.create(null);
    for (const proxy of proxies) {
      const name = proxy.name || "";
      if (LANDING_REGEX.test(name)) continue;
      if (LOW_COST_REGEX.test(name)) continue;
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
  var init_proxy_parser = __esm({
    "src/proxy_parser.ts"() {
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
  var init_rules = __esm({
    "src/rules.ts"() {
      "use strict";
      init_constants();
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
  var init_dns = __esm({
    "src/dns.ts"() {
      "use strict";
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
  var buildList;
  var init_selectors = __esm({
    "src/selectors.ts"() {
      "use strict";
      init_constants();
      buildList = (...elements) => {
        return elements.flat().filter(Boolean);
      };
    }
  });

  // src/main.ts
  var require_main = __commonJS({
    "src/main.ts"() {
      init_constants();
      init_args();
      init_proxy_groups();
      init_proxy_parser();
      init_rules();
      init_dns();
      init_selectors();
      function getRawArgs() {
        try {
          return $arguments;
        } catch {
          console.log("[powerfullz \u7684\u8986\u5199\u811A\u672C] \u672A\u68C0\u6D4B\u5230\u4F20\u5165\u53C2\u6570\uFF0C\u4F7F\u7528\u9ED8\u8BA4\u53C2\u6570\u3002", {});
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
        const countryInfo = parseCountries(resultConfig);
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
        const dnsConfig = buildDnsConfig({
          mode: "redir-host",
          ipv6Enabled
        });
        const dnsConfigFakeIp = buildDnsConfig({
          mode: "fake-ip",
          ipv6Enabled,
          fakeIpFilter: FAKE_IP_FILTER
        });
        Object.assign(resultConfig, {
          "proxy-groups": proxyGroups,
          "rule-providers": ruleProviders,
          rules: finalRules,
          sniffer: snifferConfig,
          dns: fakeIPEnabled ? dnsConfigFakeIp : dnsConfig,
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
