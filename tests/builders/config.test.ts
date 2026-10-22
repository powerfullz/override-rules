import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildFeatureFlags } from "../../src/args/parse";
import { analyzeNodes } from "../../src/analysis/classify";
import { buildBaseLists } from "../../src/builders/base-lists";
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

        // defaultSelector 展平后没有 AUTO / FALLBACK 的相互嵌套。
        assert.deepEqual(group(result, PROXY_GROUPS.SELECT)?.proxies, [
            "NodeA",
            "NodeB",
            PROXY_GROUPS.MANUAL,
            "DIRECT",
        ]);
        assert.deepEqual(group(result, PROXY_GROUPS.AUTO)?.proxies, [
            "NodeA",
            "NodeB",
            PROXY_GROUPS.MANUAL,
            "DIRECT",
        ]);
        assert.deepEqual(group(result, PROXY_GROUPS.FALLBACK)?.proxies, [
            "NodeA",
            "NodeB",
            PROXY_GROUPS.MANUAL,
            "DIRECT",
        ]);
    });

    it("空 proxies 时所有代理组都不为空", () => {
        const result = run({}, { proxies: [] });
        const groups = result["proxy-groups"] ?? [];

        assert.deepEqual(group(result, PROXY_GROUPS.SELECT)?.proxies, [
            PROXY_GROUPS.MANUAL,
            "DIRECT",
        ]);
        assert.deepEqual(group(result, PROXY_GROUPS.MANUAL)?.proxies, ["DIRECT"]);
        assert.deepEqual(group(result, PROXY_GROUPS.AUTO)?.proxies, [
            PROXY_GROUPS.MANUAL,
            "DIRECT",
        ]);
        assert.deepEqual(group(result, PROXY_GROUPS.FALLBACK)?.proxies, [
            PROXY_GROUPS.MANUAL,
            "DIRECT",
        ]);

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
            PROXY_GROUPS.MANUAL,
            "DIRECT",
        ]);
        assert.deepEqual(group(result, PROXY_GROUPS.FALLBACK)?.proxies, [
            PROXY_GROUPS.LANDING,
            PROXY_GROUPS.MANUAL,
            "DIRECT",
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
    });

    it("只有台湾时服务组不引用未生成的地区组", () => {
        const result = run({}, { proxies: [{ name: "台湾01" }, { name: "台湾02" }] });
        const allGroupNames = (result["proxy-groups"] ?? []).map((item) => item.name);

        assert.ok(!allGroupNames.includes("台湾节点"));
        assert.deepEqual(group(result, PROXY_GROUPS.BAHAMUT)?.proxies, [
            PROXY_GROUPS.SELECT,
            PROXY_GROUPS.MANUAL,
            "DIRECT",
        ]);
        assert.deepEqual(group(result, PROXY_GROUPS.BILIBILI)?.proxies, [
            "DIRECT",
            PROXY_GROUPS.SELECT,
            PROXY_GROUPS.MANUAL,
        ]);
        assert.ok(!group(result, PROXY_GROUPS.BAHAMUT)?.proxies?.includes("台湾节点"));
        assert.ok(!group(result, PROXY_GROUPS.BILIBILI)?.proxies?.includes("台湾节点"));
    });

    it("只有美国时 Truth Social 不引用未生成的地区组", () => {
        const result = run({}, { proxies: [{ name: "美国01" }, { name: "美国02" }] });

        assert.ok(!(result["proxy-groups"] ?? []).some((item) => item.name === "美国节点"));
        assert.deepEqual(group(result, PROXY_GROUPS.TRUTH_SOCIAL)?.proxies, [
            PROXY_GROUPS.SELECT,
            PROXY_GROUPS.MANUAL,
            "DIRECT",
        ]);
        assert.ok(!group(result, PROXY_GROUPS.TRUTH_SOCIAL)?.proxies?.includes("美国节点"));
    });

    it("引用同一份规则集与 Geo 数据源", () => {
        const result = run({}, CONFIG);
        assert.equal(result["rule-providers"], ruleSets);
        assert.equal(result["geodata-mode"], true);
        assert.ok(result["geox-url"]?.geoip);
    });
});
