import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
    buildGroupByType,
    fallbackGroup,
    selectAllGroup,
    selectGroup,
    urlTestGroup,
} from "../../src/domain/proxy-group";

describe("buildGroupByType", () => {
    it("groupType=0 生成 select 组", () => {
        const group = buildGroupByType({
            name: "香港节点",
            icon: "icon",
            groupType: 0,
            nodeSource: { proxies: ["a"] },
        });
        assert.equal(group.type, "select");
        assert.deepEqual(Object.keys(group), ["name", "icon", "type", "proxies"]);
    });

    it("groupType=1 生成 url-test 组", () => {
        const group = buildGroupByType({
            name: "香港节点",
            icon: "icon",
            groupType: 1,
            nodeSource: { proxies: ["a"] },
        });
        assert.equal(group.type, "url-test");
        // 键顺序决定了 YAML 输出顺序，必须稳定
        assert.deepEqual(Object.keys(group), [
            "name",
            "icon",
            "type",
            "url",
            "interval",
            "tolerance",
            "proxies",
        ]);
    });

    it("groupType=2 生成 load-balance 组", () => {
        const group = buildGroupByType({
            name: "香港节点",
            icon: "icon",
            groupType: 2,
            nodeSource: { proxies: ["a"] },
        });
        assert.equal(group.type, "load-balance");
        assert.equal(group.type === "load-balance" && group.strategy, "sticky-sessions");
    });

    it("正则模式下的 nodeSource 键顺序稳定", () => {
        const group = buildGroupByType({
            name: "香港节点",
            icon: "icon",
            groupType: 1,
            nodeSource: { "include-all": true, filter: "f", "exclude-filter": "e" },
        });
        assert.deepEqual(Object.keys(group), [
            "name",
            "icon",
            "type",
            "url",
            "interval",
            "tolerance",
            "include-all",
            "filter",
            "exclude-filter",
        ]);
    });

    it("空 nodeSource 回退到 DIRECT", () => {
        for (const groupType of [0, 1, 2] as const) {
            const group = buildGroupByType({
                name: "香港节点",
                icon: "icon",
                groupType,
                nodeSource: { proxies: [] },
            });
            assert.deepEqual(group.proxies, ["DIRECT"]);
        }
    });

    it("include-all 且无显式候选时不补 DIRECT", () => {
        const group = buildGroupByType({
            name: "香港节点",
            icon: "icon",
            groupType: 0,
            nodeSource: { "include-all": true },
        });
        assert.equal(group["include-all"], true);
        assert.equal(group.proxies, undefined);
    });
});

describe("固定结构代理组", () => {
    it("selectGroup（含 include-all）键顺序", () => {
        assert.deepEqual(Object.keys(selectGroup("n", "i", ["a"], true)), [
            "name",
            "icon",
            "type",
            "include-all",
            "proxies",
        ]);
    });

    it("selectAllGroup 仅输出 include-all，不包含 proxies", () => {
        assert.deepEqual(Object.keys(selectAllGroup("n", "i")), [
            "name",
            "icon",
            "type",
            "include-all",
        ]);
        assert.equal(selectAllGroup("n", "i").proxies, undefined);
    });

    it("selectAllGroup 可附加 exclude-filter", () => {
        const group = selectAllGroup("n", "i", "^(?:Tailscale出口)$");

        assert.deepEqual(Object.keys(group), [
            "name",
            "icon",
            "type",
            "include-all",
            "exclude-filter",
        ]);
        assert.equal(group["exclude-filter"], "^(?:Tailscale出口)$");
    });

    it("selectGroup 仅在 hidden=true 时输出 hidden 字段", () => {
        const visible = selectGroup("n", "i", ["a"]);
        assert.equal(visible.hidden, undefined);
        assert.deepEqual(Object.keys(visible), ["name", "icon", "type", "proxies"]);

        const hidden = selectGroup("n", "i", ["a"], false, true);
        assert.equal(hidden.hidden, true);
        assert.deepEqual(Object.keys(hidden), ["name", "icon", "type", "hidden", "proxies"]);
    });

    it("selectGroup 空候选回退到 DIRECT", () => {
        assert.deepEqual(selectGroup("n", "i", []).proxies, ["DIRECT"]);
    });

    it("urlTestGroup 空候选回退到 DIRECT", () => {
        assert.deepEqual(urlTestGroup("n", "i", []).proxies, ["DIRECT"]);
    });

    it("fallbackGroup 空候选回退到 DIRECT", () => {
        assert.deepEqual(fallbackGroup("n", "i", []).proxies, ["DIRECT"]);
    });

    it("selectGroup include-all 且无候选时不补 DIRECT", () => {
        const group = selectGroup("n", "i", [], true);
        assert.deepEqual(Object.keys(group), ["name", "icon", "type", "include-all"]);
        assert.equal(group.proxies, undefined);
    });

    it("urlTestGroup 键顺序", () => {
        assert.deepEqual(Object.keys(urlTestGroup("n", "i", ["a"])), [
            "name",
            "icon",
            "type",
            "url",
            "proxies",
            "interval",
            "tolerance",
        ]);
    });

    it("fallbackGroup 键顺序", () => {
        assert.deepEqual(Object.keys(fallbackGroup("n", "i", ["a"])), [
            "name",
            "icon",
            "type",
            "url",
            "proxies",
            "interval",
            "tolerance",
        ]);
    });
});
