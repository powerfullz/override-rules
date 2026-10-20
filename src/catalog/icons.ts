/**
 * 代理组图标的集中定义。
 *
 * 所有图标都通过 CDN 前缀拼接得到，变更图标或更换 CDN 只需修改此处。
 */

import { CDN_URL } from "./endpoints";

/** Koolson/Qure 彩色图标集。 */
const QURE = `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color`;

/** 本仓库自带图标。 */
const SELF = `${CDN_URL}/gh/powerfullz/override-rules@master/icons`;

/** shindgewongxj/WHATSINStash 图标集。 */
const STASH = `${CDN_URL}/gh/shindgewongxj/WHATSINStash@master/icon`;

/** Orz-3/mini 彩色图标集。 */
const MINI = `${CDN_URL}/gh/Orz-3/mini@master/Color`;

/** 各代理组对应的图标 URL。 */
export const ICONS = {
    select: `${QURE}/Proxy.png`,
    manual: `${STASH}/select.png`,
    frontProxy: `${QURE}/Area.png`,
    landing: `${QURE}/Airport.png`,
    staticResources: `${QURE}/Cloudflare.png`,
    aiService: `${QURE}/ChatGPT.png`,
    crypto: `${QURE}/Cryptocurrency_1.png`,
    finance: `${SELF}/Nasdaq.png`,
    apple: `${QURE}/Apple_2.png`,
    google: `${MINI}/Google.png`,
    microsoft: `${SELF}/Microsoft_Copilot.png`,
    xbox: `${QURE}/Xbox.png`,
    github: `${QURE}/GitHub.png`,
    bilibili: `${QURE}/bilibili.png`,
    bahamut: `${QURE}/Bahamut.png`,
    youtube: `${QURE}/YouTube.png`,
    twitch: `${QURE}/Twitch.png`,
    netflix: `${QURE}/Netflix.png`,
    tiktok: `${QURE}/TikTok.png`,
    spotify: `${QURE}/Spotify.png`,
    telegram: `${SELF}/Telegram.png`,
    twitter: `${QURE}/Twitter.png`,
    weibo: `${QURE}/Weibo.png`,
    truthSocial: `${SELF}/Truth_Social.png`,
    ehentai: `${SELF}/Ehentai.png`,
    pikpak: `${SELF}/PikPak.png`,
    sogouInput: `${SELF}/Sougou.png`,
    tailscale: `${SELF}/Tailscale.png`,
    adBlock: `${QURE}/AdBlack.png`,
    final: `${QURE}/Final.png`,
    auto: `${QURE}/Auto.png`,
    fallback: `${QURE}/Available_1.png`,
    lowCost: `${QURE}/Lab.png`,
    global: `${QURE}/Global.png`,
} as const;
