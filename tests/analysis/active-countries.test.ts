import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getActiveCountryNames } from "../../src/analysis/active-countries";
import type { ProxyNode } from "../../src/types/proxy";

function nodes(count: number): ProxyNode[] {
    return Array.from({ length: count }, (_, i) => ({ name: `n${i}` }));
}

describe("getActiveCountryNames", () => {
    it("过滤低于阈值的地区", () => {
        const result = getActiveCountryNames({ 香港: nodes(2), 美国: nodes(1), 日本: nodes(3) }, 2);
        assert.deepEqual(result, ["香港", "日本"]);
    });

    it("按 weight 排序，未配置 weight 的排末尾", () => {
        const result = getActiveCountryNames(
            { 澳大利亚: nodes(2), 香港: nodes(2), 美国: nodes(2) },
            1
        );
        assert.deepEqual(result, ["香港", "美国", "澳大利亚"]);
    });

    it("阈值为 0 时保留所有已归类地区", () => {
        const result = getActiveCountryNames({ 香港: nodes(1) }, 0);
        assert.deepEqual(result, ["香港"]);
    });
});
