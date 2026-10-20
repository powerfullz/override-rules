import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildFeatureFlags } from "../../src/args/parse";
import { ARG_DEFAULTS } from "../../src/args/schema";

describe("buildFeatureFlags", () => {
    it("无参数时使用默认值", () => {
        const flags = buildFeatureFlags({});
        assert.equal(flags.groupType, ARG_DEFAULTS.groupType);
        assert.equal(flags.countryThreshold, ARG_DEFAULTS.countryThreshold);
        assert.equal(flags.fakeIPEnabled, true);
        assert.equal(flags.ipv6Enabled, false);
        assert.equal(flags.regexFilter, false);
    });

    it("解析 grouptype 的合法取值", () => {
        assert.equal(buildFeatureFlags({ grouptype: "0" }).groupType, 0);
        assert.equal(buildFeatureFlags({ grouptype: "1" }).groupType, 1);
        assert.equal(buildFeatureFlags({ grouptype: "2" }).groupType, 2);
    });

    it("非法 grouptype 回退为默认值", () => {
        assert.equal(buildFeatureFlags({ grouptype: "9" }).groupType, ARG_DEFAULTS.groupType);
    });

    it("向后兼容 loadbalance", () => {
        assert.equal(buildFeatureFlags({ loadbalance: "true" }).groupType, 2);
        assert.equal(buildFeatureFlags({ loadbalance: "false" }).groupType, 1);
        // 显式 grouptype 优先于 loadbalance
        assert.equal(buildFeatureFlags({ loadbalance: "true", grouptype: "0" }).groupType, 0);
        assert.equal(buildFeatureFlags({ loadbalance: "false", grouptype: "2" }).groupType, 2);
        // grouptype 未指定或非法时才回退到 loadbalance
        assert.equal(buildFeatureFlags({ loadbalance: "true", grouptype: "9" }).groupType, 2);
    });

    it("fakeip 显式传 false 时关闭", () => {
        assert.equal(buildFeatureFlags({ fakeip: "false" }).fakeIPEnabled, false);
    });
});
