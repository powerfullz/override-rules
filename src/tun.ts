import type { TunConfig } from "./types";

/**
 * 构建 Mihomo/Clash 内核的 TUN 模式配置。
 * 使用 gvisor 网络栈，并排除 Tailscale 与局域网地址段以避免路由冲突。
 * @param tunEnabled - 是否启用 TUN 模式
 * @returns TUN 配置对象，包含 gvisor 栈、路由排除（100.64.0.0/10 与 fd7a:115c:a1e0::/48
 *   为 Tailscale CGNAT/IPv6 地址段，192.168.0.0/16 与 fd00::/8 为局域网地址段）、
 *   DNS 劫持及 MTU 设置
 */
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
