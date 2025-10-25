## powerfullz 的覆写规则仓库

此处存放我用于 Mihomo/Substore 的覆写规则（**不建议用于 Stash**），Inspired by [mihomo-party-org/override-hub](https://github.com/mihomo-party-org/override-hub) 内的 ACL4SSR，具有以下优点：

*   集成 [SukkaW/Surge](https://github.com/SukkaW/Surge) 和 [Cats-Team/AdRules](https://github.com/Cats-Team/AdRules) 规则
*   新增 Truth Social、E-Hentai、TikTok、加密货币等分流规则
*   移除冗余规则集
*   引入 [Loyalsoldier/v2ray-rules-dat](https://github.com/Loyalsoldier/v2ray-rules-dat) GeoSite/GeoIP
*   针对 IP 规则添加 `no-resolve` 参数，避免不必要的本地 DNS 解析，提升上网速度
*   JS 格式覆写现已实现节点国家动态识别与分组，自动为实际存在的各国家/地区节点生成对应代理组，节点变动时分组自动变化，省心省力。例如：你的订阅没有韩国的节点，则最终生成的配置中「韩国节点」这个代理组就不会出现。

谨此声明：本覆写规则为本人自用，现特此公开分享于公共平台。在未有回馈意见的情况下，自然优先满足个人需求及修正自己发现的问题。如有高见，欢迎 PR。

[点击访问 Forgejo 上的镜像](https://git.l3zc.com/powerfullz/override-rules)

### 使用方法

> 💡 **中国大陆用户访问提示**
>
> 如果您在中国大陆地区访问 `raw.githubusercontent.com` 域名时遇到困难，可以将其替换为我的镜像域名 `git.l3zc.com`。
>
> **例如**：
> *   **原始地址**: `https://raw.githubusercontent.com/powerfullz/override-rules/refs/heads/main/convert.js`
> *   **镜像地址**: `https://git.l3zc.com/powerfullz/override-rules/raw/branch/main/convert.js`
>
> 请注意路径部分 `refs/heads/main` 在镜像站上对应的是 `raw/branch/main`。下文所有来自本仓库的 `raw.githubusercontent.com` 链接均可按此规则替换。

**Clash Party/Sparkle**

1.  推荐直接使用 JS 动态覆写：`https://raw.githubusercontent.com/powerfullz/override-rules/refs/heads/main/convert.js`
2.  打开 Clash Party → 左侧「覆写」→ 粘贴上述链接导入。
3.  打开「订阅管理」→ 目标订阅右上角三个点 → 「编辑信息」→ 选择该覆写脚本 → 保存。
4.  Clash Party 不支持给脚本传入参数，如果需要传入参数，请使用集成的 Substore。

需要注意，Clash Party 在默认设置下还会接管 DNS 和 SNI（域名嗅探），需要手动在设置中关闭「控制 DNS 设置」和「控制域名嗅探」两个选项。

**SubStore**

参考[最速 Substore 订阅管理指南](https://blog.l3zc.com/2025/03/clash-subscription-convert/)。

2025/06/17 更新：新增 JavaScript 格式覆写，支持传入参数，更易于维护，已经成为首选方式。例如，有链式代理需求，使用如下覆写脚本链接即可：

```
https://raw.githubusercontent.com/powerfullz/override-rules/refs/heads/main/convert.js#landing=true
```

传入多个参数时，用`&`分隔，例如`landing=true&loadbalance=true`。

目前支持的参数：

*   `loadbalance`：启用负载均衡（url-test/load-balance，默认 false）
*   `landing`：启用落地节点功能（如机场家宽/星链/落地分组，默认 false）
*   `ipv6`：启用 IPv6 支持（默认 false）
*   `full`：生成完整配置（适合纯内核启动，默认 false）
*   `keepalive`：启用 TCP Keep Alive（默认 false）[^fn2]
*   `fakeip`：DNS 增强模式使用 `fake-ip` 而不是 `redir-host`（默认 false）
*   `quic`：屏蔽 QUIC 流量（UDP 443，默认 false）

说明：所有参数均可通过 `$arguments` 传入，支持字符串 true/false 或 1/0。

[^fn2]: 无特殊需求不要启用，否则会造成[移动设备异常耗电问题](https://github.com/vernesong/OpenClash/issues/2614)。

**Clash Verge 系**

直接复制需要的 YAML 格式覆写粘贴到覆写规则部分（无法自动更新）。

### 关于各 Mihomo 客户端覆盖 GeoIP/GeoSite 下载地址的说明

这覆写规则大量引用了 Loyalsoldier/v2ray-rules-dat，大多数 Mihomo 客户端都会覆写 GeoIP/GeoSite 数据库资源链接，为了获得更好的分流体验，建议手动修改客户端内的覆写设置。以 Mihomo Party 为例，点击侧栏中的「外部资源」，分别将资源链接替换为以下值：

| 项目 | 链接 |
| :--- | :--- |
| GeoIP 数据库 | `https://cdn.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/geoip.dat` |
| GeoSite 数据库 | `https://cdn.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/geosite.dat` |
| MMDB 数据库 | `https://cdn.jsdelivr.net/gh/Loyalsoldier/geoip@release/Country.mmdb` |
| ASN 数据库 | `https://cdn.jsdelivr.net/gh/Loyalsoldier/geoip@release/GeoLite2-ASN.mmdb` |

### 关于部分特殊代理组的说明

**静态资源**：这代理组包含所有常见静态资源 CDN 域名、对象存储域名。大部分网站的静态资源（如图片、视频、音频、字体、JS、CSS）都有独立域名、不设置风控措施、不设置鉴权，这些静态资源可以使用 IP 不一定干净（例如 IDC 类 IP）、但是带宽更大、延时更低、而且有和大部分主流 CDN（如 Cloudflare、Akamai、Fastly、EdgeCast）在 IXP 有互联的网络出口。一般就实践经验来看，在正常上网中这部分域名产生的流量占据约 70% 左右。如果你在使用商业性质的远端策略服务提供商、且该服务上提供了低倍率节点，你可以将这部分域名分流至低倍率节点以节省流量。[^fn1]

[^fn1]: 来源：[我有特别的 Surge 配置和使用技巧](https://blog.skk.moe/post/i-have-my-unique-surge-setup/)

**搜狗输入**：这代理组默认放行，作用是避免搜狗输入法将你输入的每一个字符自动收集并通过`get.sogou.com/q`等域名回传。隐私担忧者可以将其设置为`REJECT`，开启后会影响搜狗输入法账号同步、词库更新、问题反馈，但语音输入等其他功能可以正常使用。

~~**Play 商店修复**：这代理组用于修复国行设备因使用`services.googleapis.cn`域名导致的 Google Play 下载应用时的「等待中…」问题，如果使用默认的「全球直连」问题依旧，则将其切换到「节点选择」即可。使用「全球直连」代理组时，Play 商店会从国内的 CDN 下载内容。详见：[「Google Play 商店的国内 CDN：从密码学入门到分流策略优化」](https://blog.l3zc.com/2025/03/chinese-cdn-used-by-playstore/)。~~

~~**Steam 修复**： 这代理组用于让 Steam 客户端调用国内 CDN 及 P2P 网络下载，节省大量流量。如果需要代理 Steam 所有的下载请求，将其设置为「节点选择」即可。~~

Play 商店修复和 Steam 修复代理组已经默认直连，又省流量又快，Why not?

### 关于链式代理的说明

若有链式代理需求，直接在 JS 链接后加 `landing=true` 参数即可（例如：`convert.js#landing=true`）。这样会新增「落地节点」和「前置代理」两个代理组，其中「落地节点」会自动匹配名称包含「家宽」「家庭」「商宽」「落地」「Starlink/星链」等关键词的节点，其他诸如「香港节点」等国家分组会自动剔除这些落地节点。需要被链式代理的落地节点请在你的订阅里为该节点配置 `dialer-proxy: "前置代理"`，示例：

```yaml
proxies:
  - name: '香港 HGC NAT 商宽落地'
    type: ss
    server: example.com
    port: 6666
    cipher: aes-256-gcm
    password: goodpassword
    dialer-proxy: "前置代理"
```

### 关于自动生成的 YAML 格式覆写

除了直接引用 convert.js 动态覆写，你也可以使用仓库中预先生成好的 YAML 格式覆写——它们都放在 yamls/ 目录里，由 GitHub Actions 在每次推送后自动重新生成、覆盖。适用于诸如 Clash Verge 等不支持 JS 覆写的客户端和转换服务。

文件命名规则：

```
config_lb-{0|1}_landing-{0|1}_ipv6-{0|1}_full-{0|1}_keepalive-{0|1}_fakeip{0|1}.yaml
```

示例（开启 full，其余关闭）：

```
https://raw.githubusercontent.com/powerfullz/override-rules/refs/heads/main/yamls/config_lb-0_landing-0_ipv6-0_full-1_keepalive-0_fakeip-0.yaml
```

如果使用镜像：

```
https://git.l3zc.com/powerfullz/override-rules/raw/branch/main/yamls/config_lb-0_landing-0_ipv6-0_full-1_keepalive-0_fakeip-0.yaml
```

CI 只是套用一份假的`fake_proxies.json`来生成覆写，所以不可能实现 JS 覆写自动根据节点匹配生成对应代理组的功能，只能做出取舍放入常用地区的节点。如果你有条件使用 Substore，并且想要动态识别国家和传参的灵活性，还是推荐使用 JS 覆写。

### 本地生成 YAML 文件

```shell
npm install
npm run generate
```