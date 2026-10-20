/**
 * GeoIP / GeoSite / MMDB / ASN 数据源地址。
 */

import { CDN_URL } from "../catalog/endpoints";
import type { GeoxUrl } from "../types/clash";

export const geoxUrl: GeoxUrl = {
    geoip: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/geoip.dat`,
    geosite: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/geosite.dat`,
    mmdb: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/country.mmdb`,
    asn: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/GeoLite2-ASN.mmdb`,
};
