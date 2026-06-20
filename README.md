## powerfullz 的 Mihomo/Substore 覆写规则

[![](https://data.jsdelivr.com/v1/package/gh/powerfullz/override-rules/badge?style=rounded)](https://www.jsdelivr.com/package/gh/powerfullz/override-rules)

本仓库为 Mihomo/Substore 设计，提供高效、灵活的覆写规则（**不建议用于 Stash**）。核心特色如下：

* 集成 [SukkaW/Surge](https://github.com/SukkaW/Surge) 与 [217heidai/adblockfilters](https://github.com/217heidai/adblockfilters) 等优质规则，兼容性强，覆盖面广。
* 针对 Truth Social、E-Hentai、TikTok、加密货币等场景，新增专用分流规则，满足多样化需求。
* 精简冗余，结构清晰，维护便捷。
* 深度融合 [Loyalsoldier/v2ray-rules-dat](https://github.com/Loyalsoldier/v2ray-rules-dat) GeoSite/GeoIP，分流更精准。
* IP 规则默认添加 `no-resolve`，有效减少本地 DNS 解析，提升速度与隐私。
* 动态覆写：自动识别节点国家/地区，仅生成实际存在的分组，节点名称实时枚举，配置更智能。

> 本项目为本人自用，欢迎交流建议（Issue/PR）。如无特殊反馈，将优先满足个人需求与体验优化。

[点击访问 Forgejo 上的镜像](https://git.l3zc.com/powerfullz/override-rules)

### AFF

#### FlowerCloud

[注册链接](https://api-flowercloud.com/aff.php?aff=4352)

目前我的主力机场，也是一家老牌一线机场了，线路扎实，冗余足够，实验性节点0.2倍率，部分地区的高级节点是家宽落地，用起来还是很舒服的。

#### 星岛梦

[注册链接](https://luics.xdmvipaff.cc/#/?code=MMB4xSlc)

星岛梦是一家 2025 年 12 月刚开业的机场，机场主在测试的时候就来找我了，我因此有幸从早期测试阶段便开始关注，见证了机场主熬夜修线路换落地的过程，目前体验还不错。算上日常折扣性价比还可以，大家可以月付体验一下。

### 使用方法

**Clash Party/Sparkle**

> [!TIP]
> Clash Party 不支持给脚本传入参数，如果需要传入参数，请使用集成的 Substore。

1.  推荐直接使用 JS 动态覆写：`https://cdn.jsdelivr.net/gh/powerfullz/override-rules/convert.min.js`
2.  打开 Clash Party → 左侧「覆写」→ 粘贴上述链接导入。
3.  打开「订阅管理」→ 目标订阅右上角三个点 → 「编辑信息」→ 选择该覆写脚本 → 保存。

需要注意，Clash Party 在默认设置下还会接管 DNS 和 SNI（域名嗅探），需要手动在设置中关闭「控制 DNS 设置」和「控制域名嗅探」两个选项。

**Clash Verge 系（Clash Verge Rev、Clash Nyanpasu 等）**

直接复制需要的 YAML 格式覆写粘贴到覆写规则部分（无法自动更新）。

**SubStore**

参考[最速 Substore 订阅管理指南](https://blog.l3zc.com/2025/03/clash-subscription-convert/)。

2025/06/17 更新：新增 JavaScript 格式覆写，更易于维护，已经成为首选方式。JavaScript 格式覆写支持在脚本链接末尾加入`#`以传入参数，传入多个参数时，用`&`分隔，例如`#grouptype=2`。

目前支持的参数：

*   `grouptype`：地区代理组类型（0=手动选择 select，1=自动测速 url-test，2=负载均衡 load-balance，默认 1）
*   `ipv6`：启用 IPv6 支持（默认 false）
*   `full`：生成完整配置（适合纯内核启动，默认 false）
*   `keepalive`：启用 TCP Keep Alive（默认 false）[^fn2]
*   `fakeip`：DNS 增强模式使用 `fake-ip` 而不是 `redir-host`（开启后可能有助于解决 TUN 模式无法上网的问题；未传参时默认 `true`，显式传 `false` 时使用 `redir-host`）
*   `quic`：允许 QUIC 流量（UDP 443，默认 false）[^quic]
*   `regex`：各国家/地区代理组改用 `include-all` + 正则过滤模式，由 Mihomo 内核在运行时按正则动态筛选节点，而非在脚本执行时枚举节点名称（默认 false）[^regex]
*   `tun`：启用 TUN 模式（gvisor 栈，自动配置路由排除地址与 DNS 劫持，默认 false）
*   `threshold`：国家/地区节点数量小于该值时不显示分组（默认 0）

> **向后兼容**：旧的 `loadbalance` 参数仍然可用。当 `grouptype` 未指定时，`loadbalance=true` 等价于 `grouptype=2`，`loadbalance=false` 等价于 `grouptype=1`。

[^quic]: 默认屏蔽了 QUIC 流量防止节点 UDP 性能不佳影响上网体验，如果确信节点质量良好，建议设置为 true。
[^regex]: 默认情况下覆写脚本会直接把节点都筛选好，如果想让内核来筛（比如，你在 Clash Party 客户端里额外添加了自建节点，想直接通过正则表达式筛选进入配置文件）那就打开吧。

说明：支持字符串 true/false 或 1/0；。注：预生成的 YAML 格式覆写（`yamls/` 目录）固定使用正则模式，不受此参数影响。

[^fn2]: 无特殊需求不要启用，否则会造成[移动设备异常耗电问题](https://github.com/vernesong/OpenClash/issues/2614)。

#### JS 覆写使用示例

想要国家/地区代理组自动选择延迟最低的节点，使用`grouptype=1`参数，在 Substore「脚本操作」处填入脚本链接：

```
https://cdn.jsdelivr.net/gh/powerfullz/override-rules/convert.min.js#grouptype=1
```

如果想第一时间体验最新加入的 ~~Bug~~ 功能，可以使用 preview 分支的 Github Raw 链接：

```
https://raw.githubusercontent.com/powerfullz/override-rules/refs/heads/preview/convert.min.js
```

### 关于 DNS 泄露的说明

很多人问用了这覆写规则跑 DNS 泄露测试说会泄露，为此我写了一篇文章澄清一些误解，具体请看[「关于 DNS 泄露及其相关误解的说明」](https://blog.l3zc.com/2026/05/dns-leak-misunderstanding/)。

### 关于部分特殊代理组的说明

**静态资源**：包含所有常见静态资源 CDN 域名、对象存储域名。大部分网站的静态资源（如图片、视频、音频、字体、JS、CSS）都有独立域名、不设置风控措施、不设置鉴权，这些静态资源可以使用 IP 不一定干净（例如 IDC 类 IP）、但是带宽更大、延时更低、而且有和大部分主流 CDN（如 Cloudflare、Akamai、Fastly、EdgeCast）在 IXP 有互联的网络出口。一般就实践经验来看，在正常上网中这部分域名产生的流量占据约 70% 左右。如果你在使用商业性质的远端策略服务提供商、且该服务上提供了低倍率节点，你可以将这部分域名分流至低倍率节点以节省流量。[^fn1]

[^fn1]: 来源：[我有特别的 Surge 配置和使用技巧](https://blog.skk.moe/post/i-have-my-unique-surge-setup/)

**搜狗输入**：默认放行，作用是避免搜狗输入法将你输入的每一个字符自动收集并通过`get.sogou.com/q`等域名回传。隐私担忧者可以将其设置为`REJECT`，开启后会影响搜狗输入法账号同步、词库更新、问题反馈，但语音输入等其他功能可以正常使用。

~~**Play 商店修复**：~~ 修复国行设备因使用`services.googleapis.cn`域名导致的 Google Play 下载应用时的「等待中…」问题。详见：[「Google Play 商店的国内 CDN：从密码学入门到分流策略优化」](https://blog.l3zc.com/2025/03/chinese-cdn-used-by-playstore/)，已经是默认行为。

~~**Steam 修复**：~~ 用于让 Steam 客户端调用国内 CDN 及 P2P 网络下载，节省大量流量，已经是默认行为。

### 链式代理（前置代理 + 落地节点）

本脚本会自动检测订阅中的链式代理节点：如果节点带有 `dialer-proxy: "前置代理"` 字段，
该节点将被识别为**前置代理**（中继节点），其余节点视为**落地节点**（目标节点，如家宽/商宽/星链等）。

**无需任何参数。** 脚本会根据节点是否包含 `dialer-proxy` 字段自动生成相应的
「前置代理」和「落地节点」代理组，并在分组和规则中正确排除落地节点。

如果你的机场支持链式代理，只需在订阅中配置好 `dialer-proxy` 字段即可自动生效。

### 关于自动生成的 YAML 格式覆写

除了直接引用动态构建的 JS 覆写脚本外，你也可以使用预先生成好的静态 YAML 覆写文件。这适用于某些不支持执行 JS 的客户端（例如旧版的 Clash Verge）。

> [!NOTE]
> 为了保持代码仓库的纯净，`main` 主分支不再跟踪和提交生成的产物文件（如 `convert.js` 和 `yamls/`）。
> 这些构建产物目前统一由 Github Actions 的 Release 工作流在发布 `v*` 版本时，构建并自动推送到当前分支及 Release 中；工作流会自动根据 Tag（例如 `v2.1.0`）同步 `package.json` / `package-lock.json` 的版本号，无需手动改版本。

获取 YAML 覆写文件的链接格式如下：

- **最新正式版**：`/yamls/*.yaml` (默认主分支或不带分支名)
- **特定历史版本**：`@vX.Y.Z/yamls/*.yaml`

文件命名规则依据支持的开关参数穷举，格式如下：

```text
config_gt-{0|1|2}_ipv6-{0|1}_full-{0|1}_keepalive-{0|1}_fakeip-{0|1}_quic-{0|1}_tun-{0|1}.yaml
```

**获取示例（开启 full，其余关闭）：**
```text
https://cdn.jsdelivr.net/gh/powerfullz/override-rules/yamls/config_gt-0_ipv6-0_full-1_keepalive-0_fakeip-0_quic-0_tun-0.yaml
```

**固定版本获取示例：**
```text
https://cdn.jsdelivr.net/gh/powerfullz/override-rules@v0.1.0/yamls/config_gt-0_ipv6-0_full-1_keepalive-0_fakeip-0_quic-0_tun-0.yaml
```

如果使用镜像：
```text
https://git.l3zc.com/powerfullz/override-rules/raw/branch/dist/yamls/config_gt-0_ipv6-0_full-1_keepalive-0_fakeip-0_quic-0_tun-0.yaml
```

*注：CI 仅套用了一份虚拟的 `fake_proxies.json` 来模拟生成 YAML，因此它无法像 JS 动态脚本那样根据你的实际节点智能生成专属分组策略，只能保守地包含常用的国家/地区。为了最高效的分流体验，仍强烈推荐使用 JS 覆写。*

### 如何自定义与贡献

**如果你想基于本项目深度定制自己专属的覆写规则：**

请阅读 [如何自定义专属覆写规则](docs/HOW_TO_CUSTOMISE.md)。里面详细介绍了如何修改默认参数、调整代理组及增添自定义的 Rule Providers。

**如果你想为本项目贡献代码或新增特性：**

请阅读 [贡献指南](docs/HOW_TO_CONTRIBUTE.md)。里面包含关于代码规范、开发流与提交 PR 的要求。

**如果你是 AI AGENT：**

请阅读 [`./AGENTS.md`](./AGENTS.md)。
