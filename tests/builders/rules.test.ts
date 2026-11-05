import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildRules } from "../../src/builders/rules";
import { ruleSets } from "../../src/catalog/rule-sets";

describe("buildRules", () => {
    it("未启用 quic 时插入 UDP 443 拦截规则", () => {
        const rules = buildRules({ quicEnabled: false, hasTailscale: false, adblockSource: 0 });
        assert.equal(rules[0], "AND,((DST-PORT,443),(NETWORK,UDP)),REJECT");
    });

    it("启用 quic 时不插入拦截规则", () => {
        const rules = buildRules({ quicEnabled: true, hasTailscale: false, adblockSource: 0 });
        assert.ok(!rules.some((rule) => rule.startsWith("AND,")));
    });

    it("Tailscale 存在时生成对应分流规则", () => {
        const rules = buildRules({ quicEnabled: true, hasTailscale: true, adblockSource: 0 });
        assert.ok(rules.includes("IP-CIDR,100.64.0.0/10,Tailscale,no-resolve"));
        assert.ok(rules.includes("DOMAIN-SUFFIX,ts.net,Tailscale"));
    });

    it("Tailscale 不存在时不生成对应分流规则", () => {
        const rules = buildRules({ quicEnabled: true, hasTailscale: false, adblockSource: 0 });
        assert.ok(!rules.some((rule) => rule.includes("Tailscale")));
    });

    it("所有引用的规则集均已注册", () => {
        const rules = buildRules({ quicEnabled: true, hasTailscale: true, adblockSource: 2 });
        for (const rule of rules) {
            if (!rule.startsWith("RULE-SET,")) continue;
            const key = rule.split(",")[1];
            assert.ok(key in ruleSets, `未注册的规则集: ${key}`);
        }
    });

    it("以 MATCH 收尾", () => {
        const rules = buildRules({ quicEnabled: true, hasTailscale: false, adblockSource: 0 });
        assert.equal(rules.at(-1), "MATCH,Final");
    });

    it("adblock=0 时不包含任何广告拦截规则", () => {
        const rules = buildRules({ quicEnabled: true, hasTailscale: false, adblockSource: 0 });
        assert.ok(!rules.some((rule) => rule.includes("广告拦截")));
    });

    it("adblock>0 时统一引用 ADBlock 与 AdditionalFilter", () => {
        for (const adblockSource of [1, 2, 3] as const) {
            const rules = buildRules({ quicEnabled: true, hasTailscale: false, adblockSource });
            assert.ok(rules.includes("RULE-SET,ADBlock,广告拦截"));
            assert.ok(rules.includes("RULE-SET,AdditionalFilter,广告拦截"));
        }
    });
});
