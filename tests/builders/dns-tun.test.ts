import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildDns } from "../../src/builders/dns";
import { buildTunConfig } from "../../src/builders/tun";

describe("buildDns", () => {
    it("fake-ip 模式包含 fake-ip-filter", () => {
        const dns = buildDns({ fakeIPEnabled: true, ipv6Enabled: false });
        assert.equal(dns["enhanced-mode"], "fake-ip");
        assert.ok(Array.isArray(dns["fake-ip-filter"]));
        assert.ok((dns["fake-ip-filter"] ?? []).length > 0);
    });

    it("redir-host 模式不含 fake-ip-filter", () => {
        const dns = buildDns({ fakeIPEnabled: false, ipv6Enabled: false });
        assert.equal(dns["enhanced-mode"], "redir-host");
        assert.equal(dns["fake-ip-filter"], undefined);
    });

    it("继承上游 nameserver-policy 与 fake-ip-filter", () => {
        const dns = buildDns({
            fakeIPEnabled: true,
            ipv6Enabled: false,
            upstreamDns: {
                enable: true,
                ipv6: false,
                "prefer-h3": true,
                "enhanced-mode": "fake-ip",
                nameserver: [],
                fallback: [],
                "nameserver-policy": { "geosite:cn": ["223.5.5.5"] },
                "fake-ip-filter": ["+.example.org"],
            },
        });
        assert.deepEqual(dns["nameserver-policy"], { "geosite:cn": ["223.5.5.5"] });
        assert.ok(dns["fake-ip-filter"]?.includes("+.example.org"));
    });

    it("脚本控制字段优先级高于上游", () => {
        const dns = buildDns({
            fakeIPEnabled: false,
            ipv6Enabled: true,
            upstreamDns: {
                enable: true,
                ipv6: false,
                "prefer-h3": true,
                "enhanced-mode": "fake-ip",
                nameserver: [],
                fallback: [],
            },
        });
        assert.equal(dns["enhanced-mode"], "redir-host");
        assert.equal(dns.ipv6, true);
    });
});

describe("buildTunConfig", () => {
    it("无 Tailscale 时排除 Tailscale 地址段", () => {
        const tun = buildTunConfig(true, false);
        assert.deepEqual(tun["route-exclude-address"], [
            "100.64.0.0/10",
            "fd7a:115c:a1e0::/48",
            "192.168.0.0/16",
        ]);
    });

    it("有 Tailscale 时不排除 Tailscale 地址段", () => {
        const tun = buildTunConfig(true, true);
        assert.deepEqual(tun["route-exclude-address"], ["192.168.0.0/16"]);
    });

    it("保留设备名与 MTU", () => {
        const tun = buildTunConfig(false, false);
        assert.equal(tun.device, "mihomo");
        assert.equal(tun.mtu, 1500);
        assert.equal(tun.enable, false);
    });
});
