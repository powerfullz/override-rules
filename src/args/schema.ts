/**
 * 参数默认值的唯一来源。
 *
 * 若需修改脚本的默认行为（例如默认开启 IPv6），只需调整此处的取值。
 */
export const ARG_DEFAULTS = {
    /** 地区代理组类型：0=select，1=url-test，2=load-balance。 */
    groupType: 1,
    /** 地区节点数量小于该值时不生成地区组。 */
    countryThreshold: 2,
    /** 启用 IPv6 支持。 */
    ipv6Enabled: false,
    /** 输出完整内核配置。 */
    fullConfig: false,
    /** 启用 TCP keep-alive。 */
    keepAliveEnabled: false,
    /** 使用 fake-ip 增强模式。 */
    fakeIPEnabled: true,
    /** 允许 QUIC（UDP 443）流量。 */
    quicEnabled: false,
    /** 使用正则过滤模式。 */
    regexFilter: false,
    /** 启用 TUN 模式。 */
    tunEnabled: false,
    /** 去广告规则来源：0=关闭，1=adrules.top，2=217heidai，3=AWAvenue。 */
    adblockSource: 0,
} as const;
