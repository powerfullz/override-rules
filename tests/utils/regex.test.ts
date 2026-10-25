import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildNodeExcludeFilter, combineExcludeFilters } from "../../src/utils/regex";

describe("buildNodeExcludeFilter", () => {
    it("无有效节点名时返回 undefined", () => {
        assert.equal(buildNodeExcludeFilter([]), undefined);
        assert.equal(buildNodeExcludeFilter([{ name: "" }]), undefined);
    });

    it("转义节点名中的正则元字符并去重", () => {
        assert.equal(
            buildNodeExcludeFilter([
                { name: "Tailscale(A.1)" },
                { name: "Tailscale(A.1)" },
                { name: "节点B" },
            ]),
            "^(?:Tailscale\\(A\\.1\\)|节点B)$"
        );
    });
});

describe("combineExcludeFilters", () => {
    it("仅保留存在的过滤规则", () => {
        assert.equal(combineExcludeFilters(undefined, undefined), undefined);
        assert.equal(combineExcludeFilters("base", undefined), "base");
        assert.equal(combineExcludeFilters(undefined, "extra"), "extra");
    });

    it("用或运算合并两段规则", () => {
        assert.equal(
            combineExcludeFilters("美属|法属", "^(?:Tailscale出口)$"),
            "美属|法属|^(?:Tailscale出口)$"
        );
    });
});
