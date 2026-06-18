import type { CountryMeta } from "./types";
import { createCaseInsensitiveNodeMatcher } from "./utils";

export const NODE_SUFFIX = "节点";
export const CDN_URL = "https://cdn.jsdelivr.net";

export const PROXY_GROUPS = {
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
    APPLE: "苹果服务",
    GOOGLE: "谷歌服务",
    MICROSOFT: "微软服务",
    BILIBILI: "哔哩哔哩",
    BAHAMUT: "巴哈姆特",
    XBOX: "Xbox",
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
    SSH: "SSH",
    SOGOU_INPUT: "搜狗输入法",
    AD_BLOCK: "广告拦截",
    GLOBAL: "GLOBAL", // 全局代理的时候使用，参考 https://wiki.metacubex.one/config/proxy-groups/built-in/?h=global#global
    FINAL: "Final",
} as const;

export const LOW_COST_NODE_MATCHER = createCaseInsensitiveNodeMatcher(
    String.raw`0\.[0-5]|低倍率|省流|实验性`
);

export const LANDING_NODE_MATCHER = createCaseInsensitiveNodeMatcher(
    String.raw`家宽|家庭宽带|商宽|商业宽带|星链|Starlink|落地`
);

/**
 * 各地区的元数据：`weight` 决定在代理组列表中的排列顺序（值越小越靠前，未设置则排末尾）；
 * `pattern` 是用于匹配节点名称的正则字符串；`icon` 为策略组图标 URL。
 */
export const countriesMeta: Record<string, CountryMeta> = {
    香港: {
        weight: 10,
        pattern:
            "香港|港|\\b(?:HK|hk)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Hong Kong|HongKong|hongkong|HONG KONG|HONGKONG|深港|HKG|九龙|Kowloon|新界|沙田|荃湾|葵涌|🇭🇰",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png`,
    },
    澳门: {
        pattern: "澳门|\\b(?:MO|mo)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Macau|🇲🇴",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Macao.png`,
    },
    台湾: {
        weight: 20,
        pattern:
            "台|新北|彰化|\\b(?:TW|tw)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Taiwan|TAIWAN|TWN|TPE|ROC|🇹🇼|🇼🇸",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png`,
    },
    新加坡: {
        weight: 30,
        pattern:
            "新加坡|坡|狮城|\\b(?:SG|sg)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Singapore|SINGAPORE|SIN|🇸🇬",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Singapore.png`,
    },
    日本: {
        weight: 40,
        pattern:
            "日本|川日|东京|大阪|泉日|埼玉|沪日|深日|\\b(?:JP|jp)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Japan|JAPAN|JPN|NRT|HND|KIX|TYO|OSA|关西|Kansai|KANSAI|🇯🇵",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Japan.png`,
    },
    韩国: {
        weight: 45,
        pattern:
            "韩国|韩|韓|春川|Chuncheon|首尔|\\b(?:KR|kr)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Korea|KOREA|KOR|ICN|🇰🇷",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Korea.png`,
    },
    美国: {
        weight: 50,
        pattern:
            "美国|美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|纽约|亚特兰大|迈阿密|华盛顿|\\b(?:US|us)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|United States|UnitedStates|UNITED STATES|USA|America|AMERICA|JFK|EWR|IAD|ATL|ORD|MIA|NYC|LAX|SFO|SEA|DFW|SJC|🇺🇸",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/United_States.png`,
    },
    加拿大: {
        weight: 55,
        pattern:
            "加拿大|渥太华|温哥华|卡尔加里|蒙特利尔|Montreal|\\b(?:CA|ca)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Canada|CANADA|CAN|YVR|YYZ|YUL|🇨🇦",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Canada.png`,
    },
    英国: {
        weight: 60,
        pattern:
            "英国|伦敦|曼彻斯特|Manchester|\\b(?:UK|uk)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Britain|United Kingdom|UNITED KINGDOM|England|GBR|LHR|MAN|🇬🇧",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/United_Kingdom.png`,
    },
    澳大利亚: {
        pattern: "澳洲|澳大利亚|\\b(?:AU|au)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Australia|🇦🇺",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Australia.png`,
    },
    德国: {
        weight: 70,
        pattern:
            "德国|德|柏林|法兰克福|慕尼黑|Munich|\\b(?:DE|de)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Germany|GERMANY|DEU|MUC|🇩🇪",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Germany.png`,
    },
    法国: {
        weight: 80,
        pattern:
            "法国|法|巴黎|马赛|Marseille|\\b(?:FR|fr)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|France|FRANCE|FRA|CDG|MRS|🇫🇷",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/France.png`,
    },
    俄罗斯: {
        pattern: "俄罗斯|俄|\\b(?:RU|ru)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Russia|🇷🇺",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Russia.png`,
    },
    泰国: {
        pattern: "泰国|泰|\\b(?:TH|th)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Thailand|🇹🇭",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Thailand.png`,
    },
    印度: {
        pattern: "印度|\\b(?:IN|in)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|India|🇮🇳",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/India.png`,
    },
    马来西亚: {
        pattern: "马来西亚|马来|\\b(?:MY|my)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Malaysia|🇲🇾",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Malaysia.png`,
    },
    阿根廷: {
        pattern:
            "阿根廷|布宜诺斯艾利斯|\\b(?:AR|ar)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Argentina|EZE|🇦🇷",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Argentina.png`,
    },
    芬兰: {
        pattern:
            "芬兰|赫尔辛基|\\b(?:FI|fi)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Finland|HEL|🇫🇮",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Finland.png`,
    },
    埃及: {
        pattern: "埃及|开罗|\\b(?:EG|eg)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Egypt|CAI|🇪🇬",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Egypt.png`,
    },
    菲律宾: {
        pattern:
            "菲律宾|马尼拉|\\b(?:PH|ph)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Philippines|MNL|🇵🇭",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Philippines.png`,
    },
    土耳其: {
        pattern:
            "土耳其|伊斯坦布尔|\\b(?:TR|tr)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Turkey|Türkiye|IST|🇹🇷",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Turkey.png`,
    },
    乌克兰: {
        pattern: "乌克兰|基辅|\\b(?:UA|ua)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Ukraine|KBP|🇺🇦",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Ukraine.png`,
    },
};
