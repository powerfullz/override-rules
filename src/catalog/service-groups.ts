/**
 * 服务代理组的声明式目录。
 *
 * 每个服务组都是一个自包含的对象，只需在此处新增/删除一条记录即可调整服务组，
 * 无需改动组装逻辑（`builders/proxy-groups.ts`）。
 */

import { COUNTRY_KEYS } from "./countries";
import { countryGroupName, PROXY_GROUPS } from "./group-names";
import { ICONS } from "./icons";
import type { GroupBuildContext, ProxyGroupCandidate } from "../types/proxy";

export interface ServiceGroupDef {
    /** 代理组显示名称。 */
    name: string;
    /** 代理组图标 URL。 */
    icon: string;
    /** 是否附加 `include-all: true`。 */
    includeAll?: boolean;
    /** 根据构建上下文返回候选代理列表。 */
    proxies: (ctx: GroupBuildContext) => ProxyGroupCandidate[];
}

/**
 * 将「低倍率节点」组移到候选列表最前，其余候选保持原有顺序。
 *
 * `defaultProxies` 已按当前模式决定是否包含低倍率组；仅当它确实存在时调整顺序，
 * 避免在未生成低倍率组时产生悬空引用。
 */
function prioritizeLowCost(ctx: GroupBuildContext): ProxyGroupCandidate[] {
    const { defaultProxies } = ctx.lists;
    if (!defaultProxies.includes(PROXY_GROUPS.LOW_COST)) return defaultProxies;

    return [
        PROXY_GROUPS.LOW_COST,
        ...defaultProxies.filter((candidate) => candidate !== PROXY_GROUPS.LOW_COST),
    ];
}

/** 服务代理组，按输出顺序排列。 */
export const serviceGroups: ServiceGroupDef[] = [
    {
        name: PROXY_GROUPS.STATIC_RESOURCES,
        icon: ICONS.staticResources,
        proxies: prioritizeLowCost,
    },
    {
        name: PROXY_GROUPS.AI_SERVICE,
        icon: ICONS.aiService,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.CRYPTO,
        icon: ICONS.crypto,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.FINANCE,
        icon: ICONS.finance,
        proxies: (ctx) => ctx.lists.defaultProxiesDirect,
    },
    {
        name: PROXY_GROUPS.APPLE,
        icon: ICONS.apple,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.GOOGLE,
        icon: ICONS.google,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.MICROSOFT,
        icon: ICONS.microsoft,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.XBOX,
        icon: ICONS.xbox,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.GITHUB,
        icon: ICONS.github,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.BILIBILI,
        icon: ICONS.bilibili,
        proxies: (ctx) => {
            const groupedCountries = ctx.nodes.regionLayout.groupedCountries;
            return groupedCountries.includes(COUNTRY_KEYS.taiwan) &&
                groupedCountries.includes(COUNTRY_KEYS.hongKong)
                ? [
                      "DIRECT",
                      countryGroupName(COUNTRY_KEYS.taiwan),
                      countryGroupName(COUNTRY_KEYS.hongKong),
                  ]
                : ctx.lists.defaultProxiesDirect;
        },
    },
    {
        name: PROXY_GROUPS.BAHAMUT,
        icon: ICONS.bahamut,
        proxies: (ctx) =>
            ctx.nodes.regionLayout.groupedCountries.includes(COUNTRY_KEYS.taiwan)
                ? [
                      countryGroupName(COUNTRY_KEYS.taiwan),
                      PROXY_GROUPS.SELECT,
                      PROXY_GROUPS.MANUAL,
                      "DIRECT",
                  ]
                : ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.YOUTUBE,
        icon: ICONS.youtube,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.TWITCH,
        icon: ICONS.twitch,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.NETFLIX,
        icon: ICONS.netflix,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.TIKTOK,
        icon: ICONS.tiktok,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.SPOTIFY,
        icon: ICONS.spotify,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.TELEGRAM,
        icon: ICONS.telegram,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.TWITTER,
        icon: ICONS.twitter,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.WEIBO,
        icon: ICONS.weibo,
        includeAll: true,
        proxies: (ctx) => ctx.lists.defaultProxiesDirect,
    },
    {
        name: PROXY_GROUPS.TRUTH_SOCIAL,
        icon: ICONS.truthSocial,
        proxies: (ctx) =>
            ctx.nodes.regionLayout.groupedCountries.includes(COUNTRY_KEYS.unitedStates)
                ? [
                      countryGroupName(COUNTRY_KEYS.unitedStates),
                      PROXY_GROUPS.SELECT,
                      PROXY_GROUPS.MANUAL,
                  ]
                : ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.EHENTAI,
        icon: ICONS.ehentai,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.PIKPAK,
        icon: ICONS.pikpak,
        proxies: (ctx) => ctx.lists.defaultProxies,
    },
    {
        name: PROXY_GROUPS.SOGOU_INPUT,
        icon: ICONS.sogouInput,
        proxies: () => ["DIRECT", "REJECT"],
    },
];
