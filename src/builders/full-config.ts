/**
 * 完整配置（`full=true`）下追加的内核运行参数。
 */

import type { FeatureFlags } from "../types/args";
import type { ClashConfig } from "../types/clash";

/**
 * 生成适合纯内核启动的完整配置片段。
 * @param flags - 功能开关
 */
export function buildFullConfig(flags: FeatureFlags): ClashConfig {
    return {
        "mixed-port": 7890,
        "redir-port": 7892,
        "tproxy-port": 7893,
        "routing-mark": 7894,
        "allow-lan": true,
        "bind-address": "*",
        ipv6: flags.ipv6Enabled,
        mode: "rule",
        "unified-delay": true,
        "tcp-concurrent": true,
        "find-process-mode": "off",
        "log-level": "info",
        "geodata-loader": "standard",
        "external-controller": ":9999",
        "disable-keep-alive": !flags.keepAliveEnabled,
        profile: { "store-selected": true },
    };
}
