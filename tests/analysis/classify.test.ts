import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { analyzeNodes } from "../../src/analysis/classify";
import type { ProxyNode } from "../../src/types/proxy";

const PROXIES: ProxyNode[] = [
    { name: "香港01" },
    { name: "香港02" },
    { name: "台湾01" },
    { name: "香港 0.2x 大流量" },
    { name: "落地A", "dialer-proxy": "前置代理" },
    { name: "Tailscale出口", type: "tailscale" },
];

describe("analyzeNodes", () => {
    const result = analyzeNodes(PROXIES, 2);

    it("按 dialer-proxy 区分落地/非落地", () => {
        assert.equal(result.landing, true);
        assert.deepEqual(
            result.landingNodes.map((n) => n.name),
            ["落地A"]
        );
        assert.equal(result.nonLandingNodes.length, 5);
    });

    it("链式代理激活时地区分类只扫描非落地节点", () => {
        assert.deepEqual(Object.keys(result.countryNodes).sort(), ["台湾", "香港"]);
        assert.equal(result.countryNodes["香港"].length, 3);
    });

    it("按阈值过滤并排序地区名", () => {
        assert.deepEqual(result.countryNames, ["香港"]);
    });

    it("识别低倍率节点", () => {
        assert.deepEqual(
            result.lowCostNodes.map((n) => n.name),
            ["香港 0.2x 大流量"]
        );
    });

    it("识别 Tailscale 节点", () => {
        assert.equal(result.hasTailscale, true);
        assert.deepEqual(
            result.tailscaleNodes.map((n) => n.name),
            ["Tailscale出口"]
        );
    });

    it("无落地节点时不启用 landing", () => {
        const plain = analyzeNodes([{ name: "香港01" }, { name: "美国01" }], 1);
        assert.equal(plain.landing, false);
        assert.equal(plain.nonLandingNodes.length, 2);
    });
});
