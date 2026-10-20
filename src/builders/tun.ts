/**
 * TUN 模式配置构建。
 */

import { isNotNull } from "../utils/primitives";
import type { TunConfig } from "../types/clash";

/**
 * 构建 Clash 内核的 TUN 模式配置。
 *
 * 使用 gvisor 网络栈，并排除 Tailscale 与局域网地址段以避免路由冲突。
 * @param tunEnabled - 是否启用 TUN 模式
 * @param hasTailscale - 是否存在 Tailscale 节点
 * @returns TUN 配置对象。`100.64.0.0/10` 与 `fd7a:115c:a1e0::/48` 为 Tailscale
 *   CGNAT/IPv6 地址段（仅在无 Tailscale 节点时排除），`192.168.0.0/16` 为局域网地址段。
 */
export function buildTunConfig(tunEnabled: boolean, hasTailscale: boolean): TunConfig {
    return {
        enable: tunEnabled,
        stack: "gvisor",
        device: "mihomo",
        "route-exclude-address": [
            !hasTailscale ? "100.64.0.0/10" : null,
            !hasTailscale ? "fd7a:115c:a1e0::/48" : null,
            "192.168.0.0/16",
        ].filter(isNotNull),
        "dns-hijack": ["any:53"],
        mtu: 1500,
    };
}
