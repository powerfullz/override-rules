import { PROXY_GROUPS } from "./constants";

const baseRules = [
    `GEOIP,private,${PROXY_GROUPS.DIRECT},no-resolve`,
    `RULE-SET,ADBlock,${PROXY_GROUPS.AD_BLOCK}`,
    `RULE-SET,AdditionalFilter,${PROXY_GROUPS.AD_BLOCK}`,
    `RULE-SET,SogouInput,${PROXY_GROUPS.SOGOU_INPUT}`,
    `DOMAIN-SUFFIX,truthsocial.com,${PROXY_GROUPS.TRUTH_SOCIAL}`,
    `RULE-SET,StaticResources,${PROXY_GROUPS.STATIC_RESOURCES}`,
    `RULE-SET,CDNResources,${PROXY_GROUPS.STATIC_RESOURCES}`,
    `RULE-SET,AdditionalCDNResources,${PROXY_GROUPS.STATIC_RESOURCES}`,
    `RULE-SET,Weibo,${PROXY_GROUPS.WEIBO}`,
    `GEOSITE,bilibili,${PROXY_GROUPS.BILIBILI}`,
    `GEOSITE,category-ai-!cn,${PROXY_GROUPS.AI_SERVICE}`,
    `GEOSITE,youtube,${PROXY_GROUPS.YOUTUBE}`,
    `GEOSITE,telegram,${PROXY_GROUPS.TELEGRAM}`,
    `GEOSITE,google-play@cn,${PROXY_GROUPS.DIRECT}`,
    `GEOSITE,microsoft@cn,${PROXY_GROUPS.DIRECT}`,
    `GEOSITE,apple,${PROXY_GROUPS.APPLE}`,
    `GEOSITE,microsoft,${PROXY_GROUPS.MICROSOFT}`,
    `GEOSITE,google,${PROXY_GROUPS.GOOGLE}`,
    `GEOSITE,netflix,${PROXY_GROUPS.NETFLIX}`,
    `GEOSITE,spotify,${PROXY_GROUPS.SPOTIFY}`,
    `GEOSITE,bahamut,${PROXY_GROUPS.BAHAMUT}`,
    `GEOSITE,pikpak,${PROXY_GROUPS.PIKPAK}`,
    `GEOSITE,twitter,${PROXY_GROUPS.TWITTER}`,
    `RULE-SET,Crypto,${PROXY_GROUPS.CRYPTO}`,
    `RULE-SET,EHentai,${PROXY_GROUPS.EHENTAI}`,
    `RULE-SET,TikTok,${PROXY_GROUPS.TIKTOK}`,
    `RULE-SET,SteamFix,${PROXY_GROUPS.DIRECT}`,
    `RULE-SET,GoogleFCM,${PROXY_GROUPS.DIRECT}`,
    `GEOSITE,xbox,${PROXY_GROUPS.XBOX}`,
    `GEOSITE,gfw,${PROXY_GROUPS.SELECT}`,
    `GEOIP,netflix,${PROXY_GROUPS.NETFLIX},no-resolve`,
    `GEOIP,telegram,${PROXY_GROUPS.TELEGRAM},no-resolve`,
    `GEOIP,cn,${PROXY_GROUPS.DIRECT}`,
    `DST-PORT,22,${PROXY_GROUPS.SSH}`,
    `MATCH,${PROXY_GROUPS.SELECT}`,
];

/**
 * 构建最终的规则列表。
 *
 * @param {Object} params - 构建参数
 * @param {boolean} params.quicEnabled - 是否启用 QUIC（如未启用会插入 UDP:443 拦截规则）
 * @returns {string[]} 规则字符串数组
 */
export function buildRules({ quicEnabled }: { quicEnabled: boolean }): string[] {
    const ruleList = [...baseRules];
    if (!quicEnabled) {
        ruleList.unshift("AND,((DST-PORT,443),(NETWORK,UDP)),REJECT");
    }
    return ruleList;
}
