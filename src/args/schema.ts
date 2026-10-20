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
    /** 默认使用 fake-ip 增强模式。 */
    fakeIPEnabled: true,
} as const;
