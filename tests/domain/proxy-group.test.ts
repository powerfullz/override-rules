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
