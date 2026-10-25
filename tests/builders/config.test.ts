import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildFeatureFlags } from "../../src/args/parse";
import { analyzeNodes } from "../../src/analysis/classify";
import { buildBaseLists } from "../../src/builders/selectors";
import { assembleConfig } from "../../src/builders/config";
import { buildProxyGroups } from "../../src/builders/proxy-groups";
import { PROXY_GROUPS } from "../../src/catalog/group-names";
import { ruleSets } from "../../src/catalog/rule-sets";
import type { ClashConfig } from "../../src/types/clash";
import type { ProxyGroup } from "../../src/types/proxy";
import type { ScriptArgs } from "../../src/types/args";

function run(args: ScriptArgs, config: ClashConfig): ClashConfig {
    const flags = buildFeatureFlags(args);
    const proxies = config.proxies ?? [];
    const nodes = analyzeNodes(proxies, flags.countryThreshold);
    const lists = buildBaseLists({
        landing: nodes.landing,
        landingNodes: nodes.landingNodes,
        lowCostNodes: nodes.lowCostNodes,
        nonLandingNodes: nodes.nonLandingNodes,
        tailscaleNodes: nodes.tailscaleNodes,
        regexFilter: flags.regexFilter,
        regions: nodes.regionLayout,
    });
    const proxyGroups = buildProxyGroups({ flags, nodes, lists });
    return assembleConfig(config, { flags, nodes, proxyGroups });
}

function group(config: ClashConfig, name: string): ProxyGroup | undefined {
    return config["proxy-groups"]?.find((item) => item.name === name);
}

const CONFIG: ClashConfig = {
    proxies: [{ name: "香港01" }, { name: "香港02" }, { name: "美国01" }, { name: "美国02" }],
    hosts: { "example.com": ["1.2.3.4"] },
};

describe("assembleConfig", () => {
    it("追加 GLOBAL 组并以其前置组为候选", () => {
        const result = run({}, CONFIG);
        const groups = result["proxy-groups"] ?? [];
        const global = groups.at(-1);

        assert.equal(global?.name, PROXY_GROUPS.GLOBAL);
        assert.equal(global?.["include-all"], true);
        assert.deepEqual(
            global?.proxies,
            groups.slice(0, -1).map((item) => String(item.name))
        );
    });

    it("保留上游 proxies 与 hosts", () => {
        const result = run({}, CONFIG);
        assert.deepEqual(result.proxies, CONFIG.proxies);
        assert.deepEqual(result.hosts, CONFIG.hosts);
    });

    it("无上游 hosts 时不输出 hosts 字段", () => {
        const result = run({}, { proxies: [{ name: "香港01" }] });
        assert.ok(!("hosts" in result));
    });

    it("full=true 时追加完整内核参数", () => {
        const result = run({ full: "true" }, CONFIG);
        assert.equal(result["mixed-port"], 7890);
        assert.equal(result["external-controller"], ":9999");
        assert.equal(result.mode, "rule");
    });

    it("full 默认关闭", () => {
        const result = run({}, CONFIG);
        assert.equal(result["mixed-port"], undefined);
    });

    it("无地区组时三大主组直接使用节点（回归 #64）", () => {
        const result = run({}, { proxies: [{ name: "NodeA" }, { name: "NodeB" }] });

        // 展平后没有 AUTO / FALLBACK 的相互嵌套，也不再生成「手动选择」组。
        assert.deepEqual(group(result, PROXY_GROUPS.SELECT)?.proxies, ["NodeA", "NodeB", "DIRECT"]);
        assert.deepEqual(group(result, PROXY_GROUPS.AUTO)?.proxies, ["NodeA", "NodeB"]);
        assert.deepEqual(group(result, PROXY_GROUPS.FALLBACK)?.proxies, ["NodeA", "NodeB"]);
        assert.equal(group(result, PROXY_GROUPS.MANUAL), undefined);

        // 服务组也直接使用展平节点，不再引用「选择代理」。
        assert.deepEqual(group(result, PROXY_GROUPS.GOOGLE)?.proxies, ["NodeA", "NodeB", "DIRECT"]);
        assert.deepEqual(group(result, PROXY_GROUPS.FINANCE)?.proxies, [
            "DIRECT",
            "NodeA",
            "NodeB",
        ]);
        // 没有低倍率组时，静态资源组保持正常顺序。
        assert.deepEqual(group(result, PROXY_GROUPS.STATIC_RESOURCES)?.proxies, [
            "NodeA",
            "NodeB",
            "DIRECT",
        ]);
    });

    it("存在低倍率组时静态资源组优先使用低倍率节点", () => {
        const result = run(
            {},
            {
                proxies: [
                    { name: "香港01" },
                    { name: "香港02" },
                    { name: "美国01" },
                    { name: "美国02" },
                    { name: "香港 0.2x 大流量" },
                ],
            }
        );

        assert.deepEqual(group(result, PROXY_GROUPS.STATIC_RESOURCES)?.proxies, [
            PROXY_GROUPS.LOW_COST,
            PROXY_GROUPS.SELECT,
            "香港节点",
            "美国节点",
            PROXY_GROUPS.MANUAL,
            "DIRECT",
        ]);
        // 其他服务组仍保持正常顺序，低倍率组只移动一次。
        assert.deepEqual(group(result, PROXY_GROUPS.GOOGLE)?.proxies, [
            PROXY_GROUPS.SELECT,
            "香港节点",
            "美国节点",
            PROXY_GROUPS.LOW_COST,
            PROXY_GROUPS.MANUAL,
            "DIRECT",
        ]);
    });

    it("展平模式下静态资源组同样优先使用低倍率节点", () => {
        const result = run({}, { proxies: [{ name: "NodeA" }, { name: "NodeB 0.2x 大流量" }] });

        assert.deepEqual(group(result, PROXY_GROUPS.STATIC_RESOURCES)?.proxies, [
            PROXY_GROUPS.LOW_COST,
            "NodeA",
            "NodeB 0.2x 大流量",
            "DIRECT",
        ]);
        assert.deepEqual(group(result, PROXY_GROUPS.GOOGLE)?.proxies, [
            "NodeA",
            "NodeB 0.2x 大流量",
            PROXY_GROUPS.LOW_COST,
            "DIRECT",
        ]);
    });

    it("空 proxies 时所有代理组都不为空，且展平模式不生成手动选择组", () => {
        const result = run({}, { proxies: [] });
        const groups = result["proxy-groups"] ?? [];

        assert.deepEqual(group(result, PROXY_GROUPS.SELECT)?.proxies, ["DIRECT"]);
        assert.equal(group(result, PROXY_GROUPS.MANUAL), undefined);
        assert.deepEqual(group(result, PROXY_GROUPS.AUTO)?.proxies, ["DIRECT"]);
        assert.deepEqual(group(result, PROXY_GROUPS.FALLBACK)?.proxies, ["DIRECT"]);
        assert.deepEqual(group(result, PROXY_GROUPS.GOOGLE)?.proxies, ["DIRECT"]);
        assert.deepEqual(group(result, PROXY_GROUPS.FINANCE)?.proxies, ["DIRECT"]);

        for (const item of groups) {
            if (item.proxies) {
                assert.ok(item.proxies.length > 0, `${item.name} 不应包含空 proxies`);
            }
        }
    });

    it("全落地时保留落地节点组，前置代理仅包含 DIRECT", () => {
        const result = run({}, { proxies: [{ name: "落地A", "dialer-proxy": "前置代理" }] });

        assert.deepEqual(group(result, PROXY_GROUPS.LANDING)?.proxies, ["落地A"]);
        assert.deepEqual(group(result, PROXY_GROUPS.FRONT_PROXY)?.proxies, ["DIRECT"]);
        assert.deepEqual(group(result, PROXY_GROUPS.SELECT)?.proxies, [
            PROXY_GROUPS.LANDING,
            "DIRECT",
        ]);
        assert.deepEqual(group(result, PROXY_GROUPS.FALLBACK)?.proxies, [PROXY_GROUPS.LANDING]);
        assert.equal(group(result, PROXY_GROUPS.MANUAL), undefined);
        assert.deepEqual(group(result, PROXY_GROUPS.GOOGLE)?.proxies, [
            PROXY_GROUPS.LANDING,
            "DIRECT",
        ]);
        assert.deepEqual(group(result, PROXY_GROUPS.FINANCE)?.proxies, [
            "DIRECT",
            PROXY_GROUPS.LANDING,
        ]);
    });

    it("展平 + regex 时前置代理仍显式排除落地节点", () => {
        const result = run(
            { regex: "true" },
            {
                proxies: [
                    { name: "香港01" },
                    { name: "香港02" },
                    { name: "落地A", "dialer-proxy": "前置代理" },
                ],
            }
        );

        assert.deepEqual(group(result, PROXY_GROUPS.FRONT_PROXY)?.proxies, [
            "DIRECT",
            "香港01",
            "香港02",
        ]);
        assert.equal(group(result, PROXY_GROUPS.SELECT)?.["exclude-filter"], "^(?:落地A)$");
        assert.equal(group(result, PROXY_GROUPS.SELECT)?.["include-all"], true);

        const google = group(result, PROXY_GROUPS.GOOGLE);
        assert.equal(google?.["include-all"], true);
        assert.equal(google?.["exclude-filter"], "^(?:落地A)$");
        assert.deepEqual(google?.proxies, [PROXY_GROUPS.LANDING, PROXY_GROUPS.LOW_COST, "DIRECT"]);
        assert.deepEqual(group(result, PROXY_GROUPS.FINANCE)?.proxies, [
            "DIRECT",
            PROXY_GROUPS.LANDING,
            PROXY_GROUPS.LOW_COST,
        ]);
    });

    it("只有台湾时服务组不引用未生成的地区组", () => {
        const result = run({}, { proxies: [{ name: "台湾01" }, { name: "台湾02" }] });
        const allGroupNames = (result["proxy-groups"] ?? []).map((item) => item.name);

        assert.ok(!allGroupNames.includes("台湾节点"));
        assert.deepEqual(group(result, PROXY_GROUPS.BAHAMUT)?.proxies, [
            "台湾01",
            "台湾02",
            "DIRECT",
        ]);
        assert.deepEqual(group(result, PROXY_GROUPS.BILIBILI)?.proxies, [
            "DIRECT",
            "台湾01",
            "台湾02",
        ]);
        assert.ok(!group(result, PROXY_GROUPS.BAHAMUT)?.proxies?.includes("台湾节点"));
        assert.ok(!group(result, PROXY_GROUPS.BILIBILI)?.proxies?.includes("台湾节点"));
        assert.ok(!group(result, PROXY_GROUPS.BAHAMUT)?.proxies?.includes(PROXY_GROUPS.SELECT));
        assert.ok(!group(result, PROXY_GROUPS.BILIBILI)?.proxies?.includes(PROXY_GROUPS.SELECT));
    });

    it("只有美国时 Truth Social 不引用未生成的地区组", () => {
        const result = run({}, { proxies: [{ name: "美国01" }, { name: "美国02" }] });

        assert.ok(!(result["proxy-groups"] ?? []).some((item) => item.name === "美国节点"));
        assert.deepEqual(group(result, PROXY_GROUPS.TRUTH_SOCIAL)?.proxies, [
            "美国01",
            "美国02",
            "DIRECT",
        ]);
        assert.ok(!group(result, PROXY_GROUPS.TRUTH_SOCIAL)?.proxies?.includes("美国节点"));
        assert.ok(
            !group(result, PROXY_GROUPS.TRUTH_SOCIAL)?.proxies?.includes(PROXY_GROUPS.SELECT)
        );
    });

    it("regex=true 时手动选择组使用 include-all，不枚举节点名称", () => {
        const result = run({ regex: "true" }, CONFIG);
        const manual = (result["proxy-groups"] ?? []).find(
            (group) => group.name === PROXY_GROUPS.MANUAL
        );

        assert.equal(manual?.["include-all"], true);
        assert.equal(manual?.proxies, undefined);
    });

    it("regex=false 时手动选择组仍按上游顺序枚举节点名称", () => {
        const result = run({}, CONFIG);
        const manual = (result["proxy-groups"] ?? []).find(
            (group) => group.name === PROXY_GROUPS.MANUAL
        );

        assert.equal(manual?.["include-all"], undefined);
        assert.deepEqual(
            manual?.proxies,
            CONFIG.proxies?.map((node) => node.name)
        );
    });

    it("Tailscale 组隐藏且不进入手动选择列表", () => {
        const result = run(
            {},
            {
                proxies: [
                    { name: "香港01" },
                    { name: "香港02" },
                    { name: "美国01" },
                    { name: "美国02" },
                    { name: "Tailscale出口", type: "tailscale" },
                ],
            }
        );

        const tailscale = group(result, PROXY_GROUPS.TAILSCALE);
        assert.equal(tailscale?.hidden, true);
        assert.deepEqual(tailscale?.proxies, ["Tailscale出口"]);

        assert.deepEqual(group(result, PROXY_GROUPS.MANUAL)?.proxies, [
            "香港01",
            "香港02",
            "美国01",
            "美国02",
        ]);
    });

    it("展平模式下 Tailscale 节点不进入任何常规选择列表", () => {
        const result = run(
            {},
            {
                proxies: [{ name: "香港01" }, { name: "Tailscale出口", type: "tailscale" }],
            }
        );

        assert.equal(group(result, PROXY_GROUPS.MANUAL), undefined);
        assert.deepEqual(group(result, PROXY_GROUPS.SELECT)?.proxies, ["香港01", "DIRECT"]);
        assert.deepEqual(group(result, PROXY_GROUPS.AUTO)?.proxies, ["香港01"]);
        assert.deepEqual(group(result, PROXY_GROUPS.FALLBACK)?.proxies, ["香港01"]);
        assert.deepEqual(group(result, PROXY_GROUPS.GOOGLE)?.proxies, ["香港01", "DIRECT"]);
        assert.equal(group(result, PROXY_GROUPS.TAILSCALE)?.hidden, true);
    });

    it("regex 分组模式下手动选择组排除 Tailscale", () => {
        const result = run(
            { regex: "true" },
            {
                proxies: [
                    { name: "香港01" },
                    { name: "香港02" },
                    { name: "美国01" },
                    { name: "美国02" },
                    { name: "Tailscale出口", type: "tailscale" },
                ],
            }
        );

        const manual = group(result, PROXY_GROUPS.MANUAL);
        assert.equal(manual?.["include-all"], true);
        assert.equal(manual?.["exclude-filter"], "^(?:Tailscale出口)$");
    });

    it("regex 地区组与低倍率组均排除 Tailscale", () => {
        const result = run(
            { regex: "true" },
            {
                proxies: [
                    { name: "香港01" },
                    { name: "香港02" },
                    { name: "美国01" },
                    { name: "美国02" },
                    { name: "美国-Tailscale 低倍率", type: "tailscale" },
                ],
            }
        );

        assert.equal(
            group(result, "美国节点")?.["exclude-filter"],
            "美属|亚美尼亚|圣多美|普林西比|^(?:美国-Tailscale 低倍率)$"
        );
        assert.equal(
            group(result, PROXY_GROUPS.LOW_COST)?.["exclude-filter"],
            "^(?:美国-Tailscale 低倍率)$"
        );
    });

    it("regex 展平模式同时排除落地节点与 Tailscale", () => {
        const result = run(
            { regex: "true" },
            {
                proxies: [
                    { name: "香港01" },
                    { name: "落地A", "dialer-proxy": "前置代理" },
                    { name: "Tailscale出口", type: "tailscale" },
                ],
            }
        );

        const expected = "^(?:落地A|Tailscale出口)$";
        assert.equal(group(result, PROXY_GROUPS.SELECT)?.["exclude-filter"], expected);
        assert.equal(group(result, PROXY_GROUPS.GOOGLE)?.["exclude-filter"], expected);
        assert.equal(group(result, PROXY_GROUPS.TAILSCALE)?.hidden, true);
    });

    it("引用同一份规则集与 Geo 数据源", () => {
        const result = run({}, CONFIG);
        assert.equal(result["rule-providers"], ruleSets);
        assert.equal(result["geodata-mode"], true);
        assert.ok(result["geox-url"]?.geoip);
    });
});
