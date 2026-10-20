import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildBaseLists } from "../../src/builders/base-lists";
import { PROXY_GROUPS } from "../../src/catalog/group-names";

describe("buildBaseLists", () => {
    it("无落地节点且无地区组时，defaultFallback 仍有兜底，不为空", () => {
        const lists = buildBaseLists({
            landing: false,
            lowCostNodes: [],
            countryNames: [],
            nonLandingNodes: [],
            regexFilter: false,
        });

        assert.ok(lists.defaultFallback.length > 0);
        assert.ok(lists.defaultFallback.includes(PROXY_GROUPS.MANUAL));
        assert.ok(lists.defaultFallback.includes("DIRECT"));
    });

    it("地区组排在兜底之前", () => {
        const lists = buildBaseLists({
            landing: true,
            lowCostNodes: [],
            countryNames: ["香港"],
            nonLandingNodes: [{ name: "中转A" }],
            regexFilter: false,
        });

        assert.deepEqual(lists.defaultFallback, [
            PROXY_GROUPS.LANDING,
            "香港节点",
            PROXY_GROUPS.MANUAL,
            "DIRECT",
        ]);
    });
});
