import type { TunConfig } from "./types";

export function buildTunConfig(tunEnabled: boolean): TunConfig {
    return {
        enable: tunEnabled,
        stack: "gvisor",
        device: "mihomo",
        "route-exclude-address": [
            "100.64.0.0/10",
            "fd7a:115c:a1e0::/48",
            "192.168.0.0/16",
            "fd00::/8",
        ],
        "dns-hijack": ["any:53"],
        mtu: 1500,
    };
}
