/**
 * 国家/地区元数据注册表。
 *
 * 新增或调整一个地区只需修改此处的 `countriesMeta`：
 * - `pattern` 决定节点名称如何被归类；
 * - `icon`、`weight` 决定代理组的图标与排序；
 * - `excludePattern`（可选）用于排除误匹配的节点。
 *
 * 匹配用的正则在本文件底部统一派生，供分析层使用。
 */

import { CDN_URL } from "./endpoints";
import type { CountryMeta } from "../types/proxy";

const QURE = `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color`;

/**
 * 供其他模块（如服务代理组）引用的地区键。
 *
 * 将「香港 / 台湾 / 美国」这类会被别处判断的地区定义为常量，
 * 避免在 `service-groups.ts` 等处硬编码字符串导致重命名时静默失效。
 */
export const COUNTRY_KEYS = {
    hongKong: "香港",
    taiwan: "台湾",
    unitedStates: "美国",
} as const;

/**
 * 各地区的元数据：`weight` 决定在代理组列表中的排列顺序（值越小越靠前，未设置则排末尾）；
 * `pattern` 是用于匹配节点名称的正则字符串；`icon` 为策略组图标 URL。
 */
export const countriesMeta: Record<string, CountryMeta> = {
    [COUNTRY_KEYS.hongKong]: {
        weight: 10,
        pattern:
            "香港|港|\\b(?:HK|hk)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Hong Kong|HongKong|hongkong|HONG KONG|HONGKONG|深港|HKG|九龙|Kowloon|新界|沙田|荃湾|葵涌|🇭🇰",
        icon: `${QURE}/Hong_Kong.png`,
    },
    澳门: {
        pattern: "澳门|\\b(?:MO|mo)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Macau|🇲🇴",
        icon: `${QURE}/Macao.png`,
    },
    [COUNTRY_KEYS.taiwan]: {
        weight: 20,
        pattern:
            "台|新北|彰化|\\b(?:TW|tw)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Taiwan|TAIWAN|TWN|TPE|ROC|🇹🇼|🇼🇸",
        icon: `${QURE}/Taiwan.png`,
    },
    新加坡: {
        weight: 30,
        pattern:
            "新加坡|坡|狮城|\\b(?:SG|sg)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Singapore|SINGAPORE|SIN|🇸🇬",
        icon: `${QURE}/Singapore.png`,
    },
    日本: {
        weight: 40,
        pattern:
            "日本|川日|东京|大阪|泉日|埼玉|沪日|深日|\\b(?:JP|jp)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Japan|JAPAN|JPN|NRT|HND|KIX|TYO|OSA|关西|Kansai|KANSAI|🇯🇵",
        icon: `${QURE}/Japan.png`,
    },
    韩国: {
        weight: 45,
        pattern:
            "韩国|韩|韓|春川|Chuncheon|首尔|\\b(?:KR|kr)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Korea|KOREA|KOR|ICN|🇰🇷",
        icon: `${QURE}/Korea.png`,
    },
    [COUNTRY_KEYS.unitedStates]: {
        weight: 50,
        pattern:
            "美国|美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|纽约|亚特兰大|迈阿密|华盛顿|\\b(?:US|us)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|United States|UnitedStates|UNITED STATES|USA|America|AMERICA|JFK|EWR|IAD|ATL|ORD|MIA|NYC|LAX|SFO|SEA|DFW|SJC|🇺🇸",
        icon: `${QURE}/United_States.png`,
        excludePattern: "美属|亚美尼亚|圣多美|普林西比",
    },
    加拿大: {
        weight: 55,
        pattern:
            "加拿大|渥太华|温哥华|卡尔加里|蒙特利尔|Montreal|\\b(?:CA|ca)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Canada|CANADA|CAN|YVR|YYZ|YUL|🇨🇦",
        icon: `${QURE}/Canada.png`,
    },
    英国: {
        weight: 60,
        pattern:
            "英国|伦敦|曼彻斯特|Manchester|\\b(?:UK|uk)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Britain|United Kingdom|UNITED KINGDOM|England|GBR|LHR|MAN|🇬🇧",
        icon: `${QURE}/United_Kingdom.png`,
    },
    澳大利亚: {
        pattern: "澳洲|澳大利亚|\\b(?:AU|au)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Australia|🇦🇺",
        icon: `${QURE}/Australia.png`,
    },
    德国: {
        weight: 70,
        pattern:
            "德国|德|柏林|法兰克福|慕尼黑|Munich|\\b(?:DE|de)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Germany|GERMANY|DEU|MUC|🇩🇪",
        icon: `${QURE}/Germany.png`,
        excludePattern: "瓜德罗普",
    },
    法国: {
        weight: 80,
        pattern:
            "法国|法|巴黎|马赛|Marseille|\\b(?:FR|fr)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|France|FRANCE|FRA|CDG|MRS|🇫🇷",
        icon: `${QURE}/France.png`,
        excludePattern: "法属|布基纳法索|法罗",
    },
    俄罗斯: {
        pattern: "俄罗斯|俄|\\b(?:RU|ru)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Russia|🇷🇺",
        icon: `${QURE}/Russia.png`,
        excludePattern: "埃塞俄比亚|白俄罗斯",
    },
    泰国: {
        pattern: "泰国|泰|\\b(?:TH|th)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Thailand|🇹🇭",
        icon: `${QURE}/Thailand.png`,
        excludePattern: "巴泰",
    },
    印度: {
        pattern: "印度|\\b(?:IN|in)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|India|🇮🇳",
        icon: `${QURE}/India.png`,
        excludePattern: "印度洋",
    },
    马来西亚: {
        pattern: "马来西亚|马来|\\b(?:MY|my)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Malaysia|🇲🇾",
        icon: `${QURE}/Malaysia.png`,
    },
    阿根廷: {
        pattern:
            "阿根廷|布宜诺斯艾利斯|\\b(?:AR|ar)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Argentina|EZE|🇦🇷",
        icon: `${QURE}/Argentina.png`,
    },
    芬兰: {
        pattern:
            "芬兰|赫尔辛基|\\b(?:FI|fi)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Finland|HEL|🇫🇮",
        icon: `${QURE}/Finland.png`,
    },
    埃及: {
        pattern: "埃及|开罗|\\b(?:EG|eg)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Egypt|CAI|🇪🇬",
        icon: `${QURE}/Egypt.png`,
    },
    菲律宾: {
        pattern:
            "菲律宾|马尼拉|\\b(?:PH|ph)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Philippines|MNL|🇵🇭",
        icon: `${QURE}/Philippines.png`,
    },
    土耳其: {
        pattern:
            "土耳其|伊斯坦布尔|\\b(?:TR|tr)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Turkey|Türkiye|IST|🇹🇷",
        icon: `${QURE}/Turkey.png`,
    },
    乌克兰: {
        pattern: "乌克兰|基辅|\\b(?:UA|ua)(?:[-_ ]?\\d+(?:[-_ ]?[A-Za-z]{2,})?)?\\b|Ukraine|KBP|🇺🇦",
        icon: `${QURE}/Ukraine.png`,
    },
};

/** 地区名 → 用于匹配节点名称的正则。 */
export const countryRegexMap: Record<string, RegExp> = Object.fromEntries(
    Object.entries(countriesMeta).map(([country, meta]) => [country, new RegExp(meta.pattern)])
);

/** 地区名 → 用于排除误匹配的正则（仅包含配置了 `excludePattern` 的地区）。 */
export const countryExcludeRegexMap: Record<string, RegExp> = Object.fromEntries(
    Object.entries(countriesMeta)
        .filter(([, meta]) => meta.excludePattern)
        .map(([country, meta]) => [country, new RegExp(meta.excludePattern!)])
);
