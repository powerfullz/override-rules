/**
 * 代理组组装：将前置组、服务组、尾部固定组、地区组按既定顺序拼接为完整的代理组列表。
 *
 * 各类代理组的定义分别位于：
 * - 服务组：`catalog/service-groups.ts`
 * - 地区元数据：`catalog/countries.ts`
 * - 构造工厂：`domain/proxy-group.ts`
 */

import { countriesMeta } from "../catalog/countries";
import { countryGroupName, PROXY_GROUPS } from "../catalog/group-names";
import { ICONS } from "../catalog/icons";
import { LOW_COST_NODE_MATCHER } from "../catalog/low-cost";
import { serviceGroups } from "../catalog/service-groups";
import {
    buildGroupByType,
    fallbackGroup,
    selectAllGroup,
    selectGroup,
    urlTestGroup,
} from "../domain/proxy-group";
import { isNotNull } from "../utils/primitives";
import { buildNodeExcludeFilter, combineExcludeFilters } from "../utils/regex";
import type { GroupBuildContext, ProxyGroup } from "../types/proxy";

/** 顶层选择类代理组：选择代理、手动选择、以及链式代理相关组。 */
function buildFrontGroups(ctx: GroupBuildContext): Array<ProxyGroup | null> {
    // 展平模式下「选择代理」已直接列出全部非落地节点，不再生成高度重合的「手动选择」组。
    // 分组模式保留该组：regex 模式交给内核动态填充，否则按上游顺序枚举。
    const manualGroup =
        ctx.nodes.regionLayout.mode === "grouped"
            ? ctx.flags.regexFilter
                ? selectAllGroup(
                      PROXY_GROUPS.MANUAL,
                      ICONS.manual,
                      buildNodeExcludeFilter(ctx.nodes.tailscaleNodes)
                  )
                : selectGroup(PROXY_GROUPS.MANUAL, ICONS.manual, ctx.nodes.manualNames)
            : null;

    return [
        selectGroup(PROXY_GROUPS.SELECT, ICONS.select, ctx.lists.defaultSelector),
        manualGroup,
        ctx.nodes.landing
            ? selectGroup(PROXY_GROUPS.FRONT_PROXY, ICONS.frontProxy, ctx.lists.frontProxySelector)
            : null,
        ctx.nodes.landing
            ? selectGroup(
                  PROXY_GROUPS.LANDING,
                  ICONS.landing,
                  ctx.nodes.landingNodes.map((node) => node.name)
              )
            : null,
    ];
}

/** 由声明式目录生成的服务代理组。 */
function buildServiceGroups(ctx: GroupBuildContext): ProxyGroup[] {
    return serviceGroups.map((def) =>
        selectGroup(def.name, def.icon, def.proxies(ctx), def.includeAll)
    );
}

/** 尾部固定代理组：Tailscale、广告拦截、Final、自动选择、故障转移。 */
function buildTailGroups(ctx: GroupBuildContext): Array<ProxyGroup | null> {
    return [
        ctx.nodes.hasTailscale
            ? selectGroup(
                  PROXY_GROUPS.TAILSCALE,
                  ICONS.tailscale,
                  ctx.nodes.tailscaleNodes.map((node) => node.name),
                  false,
                  true
              )
            : null,
        selectGroup(PROXY_GROUPS.AD_BLOCK, ICONS.adBlock, ["REJECT", "REJECT-DROP", "DIRECT"]),
        selectGroup(PROXY_GROUPS.FINAL, ICONS.final, [PROXY_GROUPS.SELECT, "DIRECT"]),
        urlTestGroup(PROXY_GROUPS.AUTO, ICONS.auto, ctx.lists.defaultFallback),
        fallbackGroup(PROXY_GROUPS.FALLBACK, ICONS.fallback, ctx.lists.defaultFallback),
    ];
}

/** 低倍率组与各地区组。 */
function buildRegionGroups(ctx: GroupBuildContext): Array<ProxyGroup | null> {
    const { flags, nodes } = ctx;
    const hasLowCost = nodes.lowCostNodes.length > 0 || flags.regexFilter;
    const tailscaleExcludeFilter = buildNodeExcludeFilter(nodes.tailscaleNodes);

    const lowCostGroup = hasLowCost
        ? buildGroupByType({
              name: PROXY_GROUPS.LOW_COST,
              icon: ICONS.lowCost,
              groupType: flags.groupType,
              nodeSource: !flags.regexFilter
                  ? { proxies: nodes.lowCostNodes.map((node) => node.name) }
                  : {
                        "include-all": true as const,
                        filter: LOW_COST_NODE_MATCHER.pattern,
                        ...(tailscaleExcludeFilter
                            ? { "exclude-filter": tailscaleExcludeFilter }
                            : {}),
                    },
          })
        : null;

    const countryGroups = nodes.regionLayout.groupedCountries.map((country) => {
        const meta = countriesMeta[country];
        if (!meta) return null;

        const excludeFilter = combineExcludeFilters(meta.excludePattern, tailscaleExcludeFilter);
        const nodeSource = flags.regexFilter
            ? {
                  "include-all": true as const,
                  filter: meta.pattern,
                  ...(excludeFilter ? { "exclude-filter": excludeFilter } : {}),
              }
            : { proxies: nodes.countryNodes[country]?.map((node) => node.name) };

        return buildGroupByType({
            name: countryGroupName(country),
            icon: meta.icon,
            groupType: flags.groupType,
            nodeSource,
        });
    });

    return [lowCostGroup, ...countryGroups];
}

/**
 * 组装完整的代理组列表。
 * @param ctx - 代理组构建上下文
 * @returns 代理组数组（不含 GLOBAL，GLOBAL 由 `builders/config.ts` 追加）
 */
export function buildProxyGroups(ctx: GroupBuildContext): ProxyGroup[] {
    const groups: Array<ProxyGroup | null> = [
        ...buildFrontGroups(ctx),
        ...buildServiceGroups(ctx),
        ...buildTailGroups(ctx),
        ...buildRegionGroups(ctx),
    ];

    return groups.filter(isNotNull);
}
