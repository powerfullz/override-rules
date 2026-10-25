import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildBaseLists } from "../../src/builders/selectors";
import { PROXY_GROUPS } from "../../src/catalog/group-names";
import type { BuildBaseListsInput } from "../../src/types/proxy";

function buildInput(overrides: Partial<BuildBaseListsInput> = {}): BuildBaseListsInput {
    return {
        landing: false,
        landingNodes: [],
        lowCostNodes: [],
        nonLandingNodes: [],
        tailscaleNodes: [],
        regexFilter: false,
        regions: { mode: "flattened", groupedCountries: [], flattenedNodes: [] },
        ...overrides,
    };
}

describe("buildBaseLists", () => {
    it("空订阅时基础列表允许为空，由代理组构造层兜底", () => {
        const lists = buildBaseLists(buildInput());

        assert.deepEqual(lists.defaultFallback, []);
        assert.deepEqual(lists.defaultSelector, ["DIRECT"]);
        assert.deepEqual(lists.defaultProxies, ["DIRECT"]);
        assert.deepEqual(lists.defaultProxiesDirect, ["DIRECT"]);
        assert.deepEqual(lists.frontProxySelector, ["DIRECT"]);
    });

    it("分组模式下地区组排在兜底之前", () => {
        const lists = buildBaseLists(
            buildInput({
                landing: true,
                landingNodes: [{ name: "落地A", "dialer-proxy": "前置代理" }],
                nonLandingNodes: [{ name: "中转A" }],
                regions: { mode: "grouped", groupedCountries: ["香港"], flattenedNodes: [] },
            })
        );

        assert.deepEqual(lists.defaultFallback, [PROXY_GROUPS.LANDING, "香港节点"]);
        assert.deepEqual(lists.defaultSelector, [
            PROXY_GROUPS.AUTO,
            PROXY_GROUPS.FALLBACK,
            PROXY_GROUPS.LANDING,
            "香港节点",
            PROXY_GROUPS.MANUAL,
            "DIRECT",
        ]);
        assert.deepEqual(lists.defaultProxies, [
            PROXY_GROUPS.SELECT,
            PROXY_GROUPS.LANDING,
            "香港节点",
            PROXY_GROUPS.MANUAL,
            "DIRECT",
        ]);
        assert.deepEqual(lists.defaultProxiesDirect, [
            "DIRECT",
            PROXY_GROUPS.LANDING,
            "香港节点",
            PROXY_GROUPS.SELECT,
            PROXY_GROUPS.MANUAL,
        ]);
    });

    it("展平模式下直接使用非落地节点，不引用地区组或手动选择组", () => {
        const lists = buildBaseLists(
            buildInput({
                nonLandingNodes: [{ name: "香港01" }, { name: "香港02" }],
                regions: {
                    mode: "flattened",
                    groupedCountries: [],
                    flattenedNodes: [{ name: "香港01" }, { name: "香港02" }],
                },
            })
        );

        assert.deepEqual(lists.defaultSelector, [{ proxies: ["香港01", "香港02"] }, "DIRECT"]);
        assert.deepEqual(lists.defaultFallback, [{ proxies: ["香港01", "香港02"] }]);
        assert.deepEqual(lists.defaultProxies, [{ proxies: ["香港01", "香港02"] }, "DIRECT"]);
        assert.deepEqual(lists.defaultProxiesDirect, ["DIRECT", { proxies: ["香港01", "香港02"] }]);
        assert.deepEqual(lists.frontProxySelector, ["DIRECT", "香港01", "香港02"]);
        assert.ok(!lists.defaultSelector.some((item) => String(item).includes("香港节点")));
        assert.ok(!lists.defaultProxies.some((item) => String(item).includes(PROXY_GROUPS.SELECT)));
        assert.ok(
            !lists.defaultProxiesDirect.some((item) => String(item).includes(PROXY_GROUPS.SELECT))
        );
    });

    it("展平 + regex 使用 include-all，并排除落地节点", () => {
        const lists = buildBaseLists(
            buildInput({
                landing: true,
                landingNodes: [{ name: "落地A", "dialer-proxy": "前置代理" }],
                nonLandingNodes: [{ name: "香港01" }],
                regexFilter: true,
                regions: {
                    mode: "flattened",
                    groupedCountries: [],
                    flattenedNodes: [{ name: "香港01" }],
                },
            })
        );

        assert.deepEqual(lists.defaultFallback, [
            PROXY_GROUPS.LANDING,
            { "include-all": true, "exclude-filter": "^(?:落地A)$" },
        ]);
        assert.deepEqual(lists.defaultSelector, [
            PROXY_GROUPS.LANDING,
            { "include-all": true, "exclude-filter": "^(?:落地A)$" },
            PROXY_GROUPS.LOW_COST,
            "DIRECT",
        ]);
        assert.deepEqual(lists.defaultProxies, [
            PROXY_GROUPS.LANDING,
            { "include-all": true, "exclude-filter": "^(?:落地A)$" },
            PROXY_GROUPS.LOW_COST,
            "DIRECT",
        ]);
        assert.deepEqual(lists.defaultProxiesDirect, [
            "DIRECT",
            PROXY_GROUPS.LANDING,
            { "include-all": true, "exclude-filter": "^(?:落地A)$" },
            PROXY_GROUPS.LOW_COST,
        ]);
        // 前置代理必须显式枚举非落地节点，避免与落地节点的 dialer-proxy 形成循环。
        assert.deepEqual(lists.frontProxySelector, ["DIRECT", "香港01"]);
    });

    it("全落地时不含 include-all，回退到落地节点/DIRECT", () => {
        const lists = buildBaseLists(
            buildInput({
                landing: true,
                landingNodes: [{ name: "落地A", "dialer-proxy": "前置代理" }],
                regexFilter: true,
            })
        );

        assert.deepEqual(lists.defaultSelector, [
            PROXY_GROUPS.LANDING,
            PROXY_GROUPS.LOW_COST,
            "DIRECT",
        ]);
        assert.deepEqual(lists.defaultFallback, [PROXY_GROUPS.LANDING]);
        assert.deepEqual(lists.defaultProxies, [
            PROXY_GROUPS.LANDING,
            PROXY_GROUPS.LOW_COST,
            "DIRECT",
        ]);
        assert.deepEqual(lists.defaultProxiesDirect, [
            "DIRECT",
            PROXY_GROUPS.LANDING,
            PROXY_GROUPS.LOW_COST,
        ]);
        assert.deepEqual(lists.frontProxySelector, ["DIRECT"]);
    });

    it("regex 过滤时转义落地节点名中的正则元字符", () => {
        const lists = buildBaseLists(
            buildInput({
                landing: true,
                landingNodes: [{ name: "落地(A.1)", "dialer-proxy": "前置代理" }],
                nonLandingNodes: [{ name: "香港01" }],
                regexFilter: true,
                regions: {
                    mode: "flattened",
                    groupedCountries: [],
                    flattenedNodes: [{ name: "香港01" }],
                },
            })
        );

        assert.deepEqual(lists.defaultFallback[1], {
            "include-all": true,
            "exclude-filter": "^(?:落地\\(A\\.1\\))$",
        });
    });

    it("展平 + regex 同时排除落地节点与 Tailscale 节点", () => {
        const tailscale = { name: "Tailscale出口", type: "tailscale" };
        const lists = buildBaseLists(
            buildInput({
                landing: true,
                landingNodes: [{ name: "落地A", "dialer-proxy": "前置代理" }],
                nonLandingNodes: [{ name: "香港01" }, tailscale],
                tailscaleNodes: [tailscale],
                regexFilter: true,
                regions: {
                    mode: "flattened",
                    groupedCountries: [],
                    flattenedNodes: [{ name: "香港01" }],
                },
            })
        );

        const expectedSource = {
            "include-all": true,
            "exclude-filter": "^(?:落地A|Tailscale出口)$",
        };
        assert.deepEqual(lists.defaultSelector[1], expectedSource);
        assert.deepEqual(lists.defaultProxies[1], expectedSource);
        assert.deepEqual(lists.defaultProxiesDirect[2], expectedSource);
        // 前置代理显式枚举非落地节点时也不能包含 Tailscale。
        assert.deepEqual(lists.frontProxySelector, ["DIRECT", "香港01"]);
    });

    it("分组模式下前置代理排除 Tailscale 节点", () => {
        const tailscale = { name: "Tailscale出口", type: "tailscale" };
        const lists = buildBaseLists(
            buildInput({
                landing: true,
                landingNodes: [{ name: "落地A", "dialer-proxy": "前置代理" }],
                nonLandingNodes: [{ name: "香港01" }, tailscale],
                tailscaleNodes: [tailscale],
                regions: { mode: "grouped", groupedCountries: ["香港"], flattenedNodes: [] },
            })
        );

        assert.deepEqual(lists.frontProxySelector, ["香港节点", "DIRECT", "香港01"]);
    });
});
