import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildList, isNotNull, parseBool, parseNumber } from "../../src/utils/primitives";

describe("parseBool", () => {
    it("支持 boolean 与字符串形式", () => {
        assert.equal(parseBool(true), true);
        assert.equal(parseBool(false), false);
        assert.equal(parseBool("true"), true);
        assert.equal(parseBool("TRUE"), true);
        assert.equal(parseBool("1"), true);
        assert.equal(parseBool("false"), false);
        assert.equal(parseBool("0"), false);
        assert.equal(parseBool("yes"), false);
    });

    it("undefined 时回退到默认值", () => {
        assert.equal(parseBool(undefined), false);
        assert.equal(parseBool(undefined, true), true);
    });
});

describe("parseNumber", () => {
    it("解析整数并在非法时回退", () => {
        assert.equal(parseNumber("3"), 3);
        assert.equal(parseNumber(2), 2);
        assert.equal(parseNumber(null, 5), 5);
        assert.equal(parseNumber(undefined, 5), 5);
        assert.equal(parseNumber("abc", 7), 7);
    });
});

describe("buildList", () => {
    it("展平嵌套数组并过滤假值", () => {
        assert.deepEqual(buildList("a", ["b", "c"], false, null, undefined, "d"), [
            "a",
            "b",
            "c",
            "d",
        ]);
    });
});

describe("isNotNull", () => {
    it("过滤 null 保留其余值", () => {
        assert.deepEqual([1, null, 2].filter(isNotNull), [1, 2]);
    });
});
