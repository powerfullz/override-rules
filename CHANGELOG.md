# Changelog

## [2.5.4](https://github.com/powerfullz/override-rules/compare/src-v2.5.3...src-v2.5.4) (2026-06-25)


### Refactoring

- Revert "refactor: expose main via esbuild globalName to avoid globalThis pollution" ([f4a65e4](https://github.com/powerfullz/override-rules/commit/f4a65e45c49285f6bec55f050c6c3fc21307cc6d))
## [2.5.3](https://github.com/powerfullz/override-rules/compare/src-v2.5.2...src-v2.5.3) (2026-06-24)


### Bug Fixes

- Temporarily remove `console.log` as it appears to be buggy on clash verge rev ([59d77c4](https://github.com/powerfullz/override-rules/commit/59d77c43699c81393fc471481724733afb16fb41))


### Refactoring

- Expose main via esbuild globalName to avoid globalThis pollution ([c382761](https://github.com/powerfullz/override-rules/commit/c3827611f81d005e2c6046398605a4c76977bd5f))
## [2.5.2](https://github.com/powerfullz/override-rules/compare/src-v2.5.1...src-v2.5.2) (2026-06-23)


### Bug Fixes

- Argument parsing issue ([e39d0f4](https://github.com/powerfullz/override-rules/commit/e39d0f4a534a6fc0e6de8425fadbec6cfd872c01))


### Chores

- Cleanup some AI nonsense ([cf4db69](https://github.com/powerfullz/override-rules/commit/cf4db69ae7f73069eeffa0200826d6fca8f301e2))
- Remove unnecessary matcher ([ca6d68c](https://github.com/powerfullz/override-rules/commit/ca6d68c189194b8c6afd07f9b5562726df955162))


### Documentation

- Remove redundant js docs ([6f71889](https://github.com/powerfullz/override-rules/commit/6f718898845ad700d03828ffcb9838a7b73bd4fc))
- Update docs ([505a292](https://github.com/powerfullz/override-rules/commit/505a29299fd0f19ad2b304fff44ba139cf9c90fe))


### Refactoring

- Optimize `parseGroupType` function ([04bc47e](https://github.com/powerfullz/override-rules/commit/04bc47e5eafdecde9beaa469f86a19aaed741b01))
## [2.5.1](https://github.com/powerfullz/override-rules/compare/src-v2.5.0...src-v2.5.1) (2026-06-22)


### Bug Fixes

- Typecheck issue ([75832b6](https://github.com/powerfullz/override-rules/commit/75832b623ec3ad7eed3cf3a9d945f622f81c9137))


### Refactoring

- Add SPEEDTEST_URL constant ([29313d5](https://github.com/powerfullz/override-rules/commit/29313d5867ed72a422bb511739d1e6959231d1a6))
## [2.5.0](https://github.com/powerfullz/override-rules/compare/src-v2.4.3...src-v2.5.0) (2026-06-20)


### Bug Fixes

- Fix landing sort logic ([c0eecd8](https://github.com/powerfullz/override-rules/commit/c0eecd8e80c4c7d00ee809ee4c61300350b15a79))


### Chores

- Update dev dependencies ([4d1f15f](https://github.com/powerfullz/override-rules/commit/4d1f15fb1012fe4df597316ad4e5fe77d95cee24))
- Optimise icons ([052e732](https://github.com/powerfullz/override-rules/commit/052e7321fb8452d121a808e1d6fac30e0c3df122))
- Update dependencies and remove noisy dependabot ([45f77f5](https://github.com/powerfullz/override-rules/commit/45f77f555bb309b7920300008297ff4b0a88cc27))
- Bump @typescript/native-preview ([12c53b6](https://github.com/powerfullz/override-rules/commit/12c53b682ff4ab07b77d033ed8fb25e202d7f3df))


### Documentation

- Optimise  docs ([ef7158e](https://github.com/powerfullz/override-rules/commit/ef7158e7c7f7b2926fd16dfa82d4ae588ccf418f))
- Update HOW_TO_CUSTOMISE.md ([e118050](https://github.com/powerfullz/override-rules/commit/e1180506868432fd55bb7538783842b3a0c8e13b))


### Features

- 默认组类型调整回 URL-TEST ([0eec548](https://github.com/powerfullz/override-rules/commit/0eec548fe9d7400c0a7a110089b2a81df6e8cdc3))


### Refactoring

- Eliminate AI slop, auto-detect landing, simplify data flow ([3ab2e23](https://github.com/powerfullz/override-rules/commit/3ab2e23e4be83620773d049fb8350d4cb9e7724a))
## [2.4.3](https://github.com/powerfullz/override-rules/compare/src-v2.4.2...src-v2.4.3) (2026-05-23)


### Bug Fixes

- Use full geoip database to fix some precision issue ([2e8ba77](https://github.com/powerfullz/override-rules/commit/2e8ba7778d4d518a3aee5c91241600c3ba04518a))
## [2.4.2](https://github.com/powerfullz/override-rules/compare/src-v2.4.1...src-v2.4.2) (2026-05-22)


### Features

- 优化自动选择和故障转移的selector ([2a01839](https://github.com/powerfullz/override-rules/commit/2a0183906439d282ee19c7ab4947c6c227793b89))
## [2.4.1](https://github.com/powerfullz/override-rules/compare/src-v2.4.0...src-v2.4.1) (2026-05-21)


### Bug Fixes

- Remove `geosite:cn` from fake-ip-filter ([90d2d46](https://github.com/powerfullz/override-rules/commit/90d2d46746c41318781343c420e1b3f32aa39e8f))


### Documentation

- 更新自动选择相关的说明 ([b22dc48](https://github.com/powerfullz/override-rules/commit/b22dc4879eb295fc7c9713cd2a49cc2cd4a89b87))


### Features

- Add Twitch proxy group ([a638feb](https://github.com/powerfullz/override-rules/commit/a638feb7aaec4efbc2e2479878c9f0922aaa1283))


### Refactoring

- 更新 GeoIP 和 GeoSite 数据库链接至 MetaCubeX ([0d90c80](https://github.com/powerfullz/override-rules/commit/0d90c80d6089299cedd916b9197124d716fd7df6))
## [2.4.0](https://github.com/powerfullz/override-rules/compare/src-v2.3.4...src-v2.4.0) (2026-05-21)


### Chores

- Update dependencies ([76ff80f](https://github.com/powerfullz/override-rules/commit/76ff80f94eb76938a7741e4601ee0d4dbc5f47b6))
- Bump yaml from 2.8.4 to 2.9.0 ([fa42bec](https://github.com/powerfullz/override-rules/commit/fa42bec3eac06b974c63da59e4e6cdecf89b93d0))
- Update dependencies ([13ed461](https://github.com/powerfullz/override-rules/commit/13ed4617cbd1e6fefac455b4f04a49c08db1ee32))


### Documentation

- 补全 tun.ts 的 JSDoc 并优化 parseGroupType 注释 ([9182209](https://github.com/powerfullz/override-rules/commit/9182209525415c534265e6d1f661317b07957830))
- 添加关于 DNS 泄露的说明及相关链接 ([e11641a](https://github.com/powerfullz/override-rules/commit/e11641a5ba7f4a660f757a9c373bef84df974ff6))


### Features

- 移除 PROXY_GROUPS.DIRECT 并添加 FINAL 代理组 ([5e84735](https://github.com/powerfullz/override-rules/commit/5e847353d6ae914b4b35fdc0d124cc643247be1c))
- Remove `PROXY_GROUPS.DIRECT` ([904277c](https://github.com/powerfullz/override-rules/commit/904277c2a20ebb45f6cd1bff2e6fab908a7141b3))
- Optimise the priority of rules ([154d59d](https://github.com/powerfullz/override-rules/commit/154d59d6ce8c49e78444c329f0c282edd10960fa))
- Use gfwlist ruleset instead of geosite ([532ff4e](https://github.com/powerfullz/override-rules/commit/532ff4e87d34a3ea5c5c8dbf59703e33004605cd))


### Refactoring

- 让 LOW_COST 代理组跟随 grouptype ([f12dd89](https://github.com/powerfullz/override-rules/commit/f12dd89c5eca4dbb66d70679d34fbeb5458151c0))
- 重构 loadbalance 参数为 grouptype 参数 ([ad77147](https://github.com/powerfullz/override-rules/commit/ad77147114d56e5fbb3c4c46eb4c7f9629e840ab))
## [2.3.4](https://github.com/powerfullz/override-rules/compare/src-v2.3.3...src-v2.3.4) (2026-05-15)


### Bug Fixes

- Use yaml payload for better compatibility ([cfcbed7](https://github.com/powerfullz/override-rules/commit/cfcbed79800d6c35d0f80108d7e9f4b3da315f78))


### Features

- Add GitHub proxy group and optimise rules ([d7ae690](https://github.com/powerfullz/override-rules/commit/d7ae6905cf2467ef0cd840b4e36d99c4d2c731c9))
- Optimise rules and add xbox proxy group ([4869ce9](https://github.com/powerfullz/override-rules/commit/4869ce97cf6bd3a536ea88e95e43ea63abcf5808))
## [2.3.3](https://github.com/powerfullz/override-rules/compare/src-v2.3.2...src-v2.3.3) (2026-05-14)


### Features

- Optimise `countriesMeta` ([0b999b4](https://github.com/powerfullz/override-rules/commit/0b999b43d1790713acd6fc722533199ab93219e1))
## [2.3.2](https://github.com/powerfullz/override-rules/compare/src-v2.3.1...src-v2.3.2) (2026-05-13)


### Refactoring

- Simplify buildFeatureFlags assignment and update fakeip documentation ([e1a454f](https://github.com/powerfullz/override-rules/commit/e1a454fc65ceabbe1a1da575dc85f37ad4ee5aa2))
## [2.3.1](https://github.com/powerfullz/override-rules/compare/src-v2.3.0...src-v2.3.1) (2026-05-13)


### Chores

- Simplify source code tip ([c07d7c1](https://github.com/powerfullz/override-rules/commit/c07d7c1417f359427f07676f0c652a10852487a3))
- Update banner ([9d26e30](https://github.com/powerfullz/override-rules/commit/9d26e30ba8cb14c5cb0b5d395c71f1f2736ff2db))
## [2.3.0](https://github.com/powerfullz/override-rules/compare/src-v2.2.0...src-v2.3.0) (2026-05-13)


### Chores

- Migrate changelog generation from conventional-changelog-cli to git-cliff ([d2d45fe](https://github.com/powerfullz/override-rules/commit/d2d45fe1b7aa4a2b98c261f38a722729f59a4ec1))


### Documentation

- Update readme ([88af701](https://github.com/powerfullz/override-rules/commit/88af70156b3c2786883196bff766090e70af6121))


### Features

- Add `include-all` param to weibo proxy group ([58031b2](https://github.com/powerfullz/override-rules/commit/58031b2b76116e0be4827829f89dc2b6eefa1550))
- Add TUN mode support via tun parameter ([5d74af4](https://github.com/powerfullz/override-rules/commit/5d74af4772445155168410c59e069e421063c29a))


### Refactoring

- Move build.mjs and yaml_generator into scripts/ ([cbddb5f](https://github.com/powerfullz/override-rules/commit/cbddb5f60bef2a5fb36b3c89f4146226707c081e))
## [2.2.0](https://github.com/powerfullz/override-rules/compare/src-v2.1.1...src-v2.2.0) (2026-05-13)


### Chores

- Bump @typescript/native-preview ([7458eef](https://github.com/powerfullz/override-rules/commit/7458eefca0c67c4adfe2fd29a2da650d88603740))
- Bump @types/node from 25.6.0 to 25.6.2 ([132547a](https://github.com/powerfullz/override-rules/commit/132547a74e29472f0846a56a2f72be1bb78e38c8))
- Bump typescript-eslint from 8.59.1 to 8.59.2 ([f2ec6a1](https://github.com/powerfullz/override-rules/commit/f2ec6a1494aa5ea45dcaee114d007a9763b88203))
- Bump lint-staged from 16.4.0 to 17.0.4 ([5221c83](https://github.com/powerfullz/override-rules/commit/5221c83a677a1dc882bd18ba9cdb4ae9d00da11c))


### Refactoring

- 将 fullConfigFields 内联至 return 语句 ([c11b25d](https://github.com/powerfullz/override-rules/commit/c11b25dd9b3293cc2d8daee16b741e1c3775d6a2))
- 将 main() 重构为纯函数并迁移构建脚本至 ESM ([c407410](https://github.com/powerfullz/override-rules/commit/c407410f0d947403cfd9a58fa259587663d45111))
- 用严格结构化类型替换弱类型 UnknownRecord ([302fe21](https://github.com/powerfullz/override-rules/commit/302fe21d632251c081fbc45fbf892b09c3678550))
## [2.1.1](https://github.com/powerfullz/override-rules/compare/src-v2.1.0...src-v2.1.1) (2026-05-06)


### Bug Fixes

- Make AI category more prioritized ([71c10c1](https://github.com/powerfullz/override-rules/commit/71c10c154c61cc2db2420c7346cb8daa82e4a572))


### Chores

- Bump typescript-eslint from 8.59.0 to 8.59.1 ([b404d22](https://github.com/powerfullz/override-rules/commit/b404d222f9dbe9b33b13352b6ca86b9bcac3a047))
- Bump yaml from 2.8.3 to 2.8.4 ([01dea52](https://github.com/powerfullz/override-rules/commit/01dea5287737315b98c7136c56e442d4a274c853))
- Bump eslint from 10.2.1 to 10.3.0 ([da6891d](https://github.com/powerfullz/override-rules/commit/da6891da76aceb7a1a1f2e3ad2d0599bb8cc6af3))
- Bump @typescript/native-preview ([2559124](https://github.com/powerfullz/override-rules/commit/2559124553ba89ad84ace76b55af84c9a1da1064))
- Bump typescript-eslint from 8.58.2 to 8.59.0 ([3dec786](https://github.com/powerfullz/override-rules/commit/3dec7869bea0cc3ec6f819193a0f27175a5e6ab7))
- Bump @typescript/native-preview ([6545c0f](https://github.com/powerfullz/override-rules/commit/6545c0f498a57e3d613916f9d2bb3eb5696ce207))


### Features

- Improve telegram icon ([a1fa360](https://github.com/powerfullz/override-rules/commit/a1fa360fcc18f8de5d40f82e38273808a4f0c67e))
## [2.1.0](https://github.com/powerfullz/override-rules/compare/src-v2.0.16...src-v2.1.0) (2026-04-26)


### Bug Fixes

- Correct icon link for porn proxy group ([3817607](https://github.com/powerfullz/override-rules/commit/3817607f5c71a53ab2ea80242b2691af0987329a))


### Documentation

- Add JSDoc for `rules.ts` ([28e2114](https://github.com/powerfullz/override-rules/commit/28e2114777b6e6d3d219be838617cf28765e6d63))
- Add JSDoc for `dns.ts` ([ebd08bd](https://github.com/powerfullz/override-rules/commit/ebd08bda136dcc2ee1e1a286b237341e36a2200d))
- Refine JSDoc for functions ([80e5e37](https://github.com/powerfullz/override-rules/commit/80e5e37b48687d05ca3218999edda29fd904ee3c))


### Features

- 添加新的代理组和规则，包括微博、Twitter、成人内容和影音娱乐 ([49f1b4b](https://github.com/powerfullz/override-rules/commit/49f1b4bfbdadafdf23f7b72774053ff05e895704))
- Add 6 new countries ([9e91b51](https://github.com/powerfullz/override-rules/commit/9e91b51dbbb21e711073b611e1a428f58da7fe91))


### Other

- Refine the order of proxy groups ([3b33507](https://github.com/powerfullz/override-rules/commit/3b33507cd7e10be2fa0488f57bde59e51eabeeb8))
- Update truth_social icon ([89529d1](https://github.com/powerfullz/override-rules/commit/89529d172bf5cc173394224ad782613964ab3266))
- Update telegram icon ([c116a30](https://github.com/powerfullz/override-rules/commit/c116a30dfef751a82ff87b76a10167b623624378))


### Refactoring

- 移除影音娱乐和成人内容代理组 ([1f5e5a3](https://github.com/powerfullz/override-rules/commit/1f5e5a3471fd1f92f84dc9bfa9394bc89f344526))
## [2.0.15](https://github.com/powerfullz/override-rules/compare/src-v2.0.14...src-v2.0.15) (2026-04-26)


### Chores

- Migrate tag prefix from v to src-v ([4eef4b8](https://github.com/powerfullz/override-rules/commit/4eef4b8fa19327ddaeb8f34e8564b89a34ae8335))
- Refine icons for better visual effect ([53b2b4b](https://github.com/powerfullz/override-rules/commit/53b2b4b9d4d18d2354ecb231c36b29a2125c295b))
## [2.0.14](https://github.com/powerfullz/override-rules/compare/src-v2.0.4...src-v2.0.14) (2026-04-26)


### Bug Fixes

- Respect landing flag in country parsing ([f109af7](https://github.com/powerfullz/override-rules/commit/f109af7b56bfd616a555318121f6cefc8f7b6b40))
- Align `LOW_COST_GROUP_PATTERN` with  `LOW_COST_FILTER` ([d76379b](https://github.com/powerfullz/override-rules/commit/d76379bf766341260756bd75c5353c1cd020eb5f))
- 更新构建目标至 ES2025 ([9be6c8c](https://github.com/powerfullz/override-rules/commit/9be6c8c29ec465e336a2fb7133bceab746985fa9))
- Jsdelivr purge 405 error ([a1f742d](https://github.com/powerfullz/override-rules/commit/a1f742d3e8c42271f7b0499da225fe1003d5c5fa))
- 修复 load-balance 的构建逻辑 ([1bc77a1](https://github.com/powerfullz/override-rules/commit/1bc77a174fe89a1a9544036e36f51cb221cfb4d2))


### CI

- Update publish text ([f7aa12a](https://github.com/powerfullz/override-rules/commit/f7aa12a9345bb5a2c55c45f6d699b695abc1d515))


### Chores

- 更新 ESLint 和 TypeScript 配置以支持 ES2025 ([9465a51](https://github.com/powerfullz/override-rules/commit/9465a515f793806e46860cdb5c91d9bf62846a2a))
- 移除版本同步脚本和相关步骤，更新版本号至 2.0.9 ([0515232](https://github.com/powerfullz/override-rules/commit/0515232f17ee3c6d3349511350cd5a27d71bd0ae))
- 调整 CI 顺序 ([3d22de0](https://github.com/powerfullz/override-rules/commit/3d22de0890c027606e85a1139358dc251531ec15))
- Migrate ESLint config to MJS ([0571efe](https://github.com/powerfullz/override-rules/commit/0571efe839dff2b2f39bc3325f8194dd31c558ff))
- Upgrade deps and align CI runtime ([65b9d0a](https://github.com/powerfullz/override-rules/commit/65b9d0a5281c77e90238aa6f33d5b46c608115b3))
- Release v2.0.7 ([85d33de](https://github.com/powerfullz/override-rules/commit/85d33de169317b553211e2efe5d27b8b0a568736))
- Migrate to cdn.jsdelivr domain ([395027a](https://github.com/powerfullz/override-rules/commit/395027a41f13db0f7efdf409b22af1aed9e220c1))
- Release v2.0.6 ([b72687d](https://github.com/powerfullz/override-rules/commit/b72687d309025f8505f4cd3e7e84f32a0ba19291))
- Setup husky pre-commit and fix ci format check ([6c07a88](https://github.com/powerfullz/override-rules/commit/6c07a88265f0a8463ca9c5c5f7e64d1d3dcd24c3))


### Documentation

- 新增贡献者指南和自定义指南 ([d821e0e](https://github.com/powerfullz/override-rules/commit/d821e0e417cacf87f85cc457a44e9a11884799da))
- Update docs for AI Agents ([d00239f](https://github.com/powerfullz/override-rules/commit/d00239fbe75f661bf3e2e7e6bbd32b7c93d6399f))


### Features

- Optimize proxy region regex and add NL/TR regions ([9df4f52](https://github.com/powerfullz/override-rules/commit/9df4f521d57e3d11211565a215e67766bad54fda))
- Add automatic publishing system ([c3f331c](https://github.com/powerfullz/override-rules/commit/c3f331c543292c7b24dca1ce1952139cc8b5f4f5))
- 添加版本同步功能，自动根据 Git 标签更新 package.json 和 package-lock.json 的版本号 ([bbae664](https://github.com/powerfullz/override-rules/commit/bbae6640918e507e695f183b8bd45708feccc912))
- 将解析函数移至 utils.ts，简化 args.ts 和 selectors.ts ([f465521](https://github.com/powerfullz/override-rules/commit/f465521ed4fee7f46eefa00ed6a48655873b6add))


### Other

- Update AI service icon ([a38dcac](https://github.com/powerfullz/override-rules/commit/a38dcac494496a6e0914e34aeac4f0c8cd5c9998))
- 暂时移除荷兰和土耳其的国家元数据 ([6b77e3d](https://github.com/powerfullz/override-rules/commit/6b77e3dce90e32e8a99c81c33016d17f154d8243))
- Remove `lazy: false` directive ([33c5651](https://github.com/powerfullz/override-rules/commit/33c5651fda0d9efb6e4c8e018fef8a78a3839d74))
- Configure Dependabot for npm and GitHub Actions

Updated Dependabot configuration to include npm and GitHub Actions updates with specific schedules and labels. ([1fd9521](https://github.com/powerfullz/override-rules/commit/1fd95216750685d94a4327524682b79c6600ba8e))


### Refactoring

- Centralize special node matchers ([0dca9bd](https://github.com/powerfullz/override-rules/commit/0dca9bd2fdd310f1b5005a4880265da42f513dce))
- Refactor file structure for better maintainability ([0850607](https://github.com/powerfullz/override-rules/commit/0850607a862a13c17fd7a7bb2ac642bf405686d3))
## [2.0.4](https://github.com/powerfullz/override-rules/compare/src-v2.0.3...src-v2.0.4) (2026-04-20)


### Bug Fixes

- Remove top-level await in build.ts ([1e5791e](https://github.com/powerfullz/override-rules/commit/1e5791ea327a7fadd2716127e4b8e03ac3ee9de1))
## [2.0.3](https://github.com/powerfullz/override-rules/compare/src-v2.0.2...src-v2.0.3) (2026-04-20)


### Bug Fixes

- Format bug ([72d1fb9](https://github.com/powerfullz/override-rules/commit/72d1fb9ba795f6829d1b4f422e1a277f606a934b))
## [2.0.2](https://github.com/powerfullz/override-rules/compare/src-v2.0.0...src-v2.0.2) (2026-04-20)


### CI

- Update release note links to use gcore jsdelivr and chinese text ([c552267](https://github.com/powerfullz/override-rules/commit/c5522678718d77987ad65ab5994ecbea48ac40bb))


### Chores

- Release v2.0.2 ([6538ff8](https://github.com/powerfullz/override-rules/commit/6538ff8f29a003879797bd0f24e0519d304f0b58))
- Optimize build process and configure dist root release for jsDelivr ([562bfd1](https://github.com/powerfullz/override-rules/commit/562bfd197fd2a4ce275a5b43640843c1a8e7b4a5))


### Documentation

- Update docs ([232c767](https://github.com/powerfullz/override-rules/commit/232c767a7c3e255c53e7e7eed645c8c3d0f9ed4d))
## [2.0.0](https://github.com/powerfullz/override-rules/compare/...src-v2.0.0) (2026-04-20)


### Bug Fixes

- Re-introduce GLOBAL proxy group ([0b0b505](https://github.com/powerfullz/override-rules/commit/0b0b505b419b3d5725ede4c8a75461f4aa441163))
- 优化前置代理选择器的构建逻辑 ([dd0c181](https://github.com/powerfullz/override-rules/commit/dd0c18163bbde935dab331ef96d73aa58c77ad98))
- Refine front proxy selector ([f5e26ec](https://github.com/powerfullz/override-rules/commit/f5e26ec21b49679b5ec70df7667ea7d0b4278dfa))
- Also include landing in direct group ([d24a8e8](https://github.com/powerfullz/override-rules/commit/d24a8e8c162b9cc417df716cb6615f8465f77b6c))
- 消除「前置代理」组与 GLOBAL 组在 dialer-proxy 场景下的循环引用 ([3d53be8](https://github.com/powerfullz/override-rules/commit/3d53be8d1a3ee8200bb692791974fb3b3997a647))
- 修正措辞 ([17cf050](https://github.com/powerfullz/override-rules/commit/17cf050ba3e45fb67cd1be757c5333a83cddbac9))
- 调整代理组选择顺序，优先自动选择 ([e833b29](https://github.com/powerfullz/override-rules/commit/e833b2978750c40f3eb8291410147506c97fb8d7))
- Update proxy group name ([5223963](https://github.com/powerfullz/override-rules/commit/52239630d33799b61d2e77f68ceef4ea939f197b))
- Fix typo ([63bcebd](https://github.com/powerfullz/override-rules/commit/63bcebdd55ab682cb12307a4e07ad178aa991fb4))
- Correct rule names ([e07740e](https://github.com/powerfullz/override-rules/commit/e07740eb20174c88b687c57b5e21da217ef6339d))
- Fix typo ([60f8302](https://github.com/powerfullz/override-rules/commit/60f830257074e8b4c07879d3024b80dbc0a6e4df))
- Regex 参数固定为 true，从 FLAGS 组合枚举中移除 ([6ad87c9](https://github.com/powerfullz/override-rules/commit/6ad87c935bc59911200ff964c071b6f92dd03e15))
- 枚举模式下低倍率节点组改用 parseLowCost 枚举节点名称 ([35fb10b](https://github.com/powerfullz/override-rules/commit/35fb10bdb7827c4e114f823e3d5d29a49fcfcd17))
- 枚举模式下低倍率节点不再被纳入国家代理组 ([02eca43](https://github.com/powerfullz/override-rules/commit/02eca43e478b248fe91f57d79ff992e7a9767add))
- Fix forgejo sync ([28a8da2](https://github.com/powerfullz/override-rules/commit/28a8da21ecdac291ff9bca077d06f073c41b1a7e))
- Fix onedrive icon ratio problem ([a6dd03d](https://github.com/powerfullz/override-rules/commit/a6dd03da29fd43aa18d1e34ae3aab99f6f4006ab))
- Fix google issue ([ddc7e98](https://github.com/powerfullz/override-rules/commit/ddc7e98510669512cc5903ddb9340c74fa52cc7f))
- 更新遗漏的 JSDelivr 地址 ([5d6885d](https://github.com/powerfullz/override-rules/commit/5d6885ddc02dfb1cd15a4e22747fdd5f48161fec))
- 严格区分大小写，避免某些误匹配问题 ([0eb14ab](https://github.com/powerfullz/override-rules/commit/0eb14ab7182859dc979c58a3f4272a7946c67949))
- Fix syncing ([3cfa3fd](https://github.com/powerfullz/override-rules/commit/3cfa3fdb33ac88a6423724cb9739d758328c199c))
- 改用 Gcore 子域名缓解 jsdelivr DNS 污染导致的图标加载问题 ([4f63f95](https://github.com/powerfullz/override-rules/commit/4f63f953877b1db97d9c052e16b93841ff195206))
- Fix formatting for domain rules in convert.js ([95a22a8](https://github.com/powerfullz/override-rules/commit/95a22a8b27095aa34fd3a8693570bd00c23cb4d6))
- 修复googleplaycn服务器失效导致的问题 ([40b5e09](https://github.com/powerfullz/override-rules/commit/40b5e0922a322746d4154d9e9046061adc9b075a))
- Resolve an issue related to quic rule ([9025f26](https://github.com/powerfullz/override-rules/commit/9025f267caeb75922bef7d5c08ced4684a2f3efc))
- Provide reject and reject-drop simultaneously ([c4d44f9](https://github.com/powerfullz/override-rules/commit/c4d44f91c8883e1dd1be0bd291a45e64c2096a0e))
- Block QUIC traffic by default ([6f6bb0b](https://github.com/powerfullz/override-rules/commit/6f6bb0b84bef9f469399e942f23cb0245465cb5f))
- 修复仓库同步 ([02a2163](https://github.com/powerfullz/override-rules/commit/02a2163d71cca4be243cce30c5445eac1383ad35))
- 修改节点选择和手动切换的命名，增加 Crypto 规则集 ([7d9cea0](https://github.com/powerfullz/override-rules/commit/7d9cea0fcac0f47071e0aa9d6540cba85213dbd3))
- 还得是 JSDelivr ([abc3f23](https://github.com/powerfullz/override-rules/commit/abc3f233867d06353582949ce8acdbc30588a4f8))
- 优化 AI 代理组图标 ([449487c](https://github.com/powerfullz/override-rules/commit/449487c06ca1da369a89dd704cd9f26464896848))
- 移除 SpeedTest 相关规则和配置 ([5d805a8](https://github.com/powerfullz/override-rules/commit/5d805a83d1a88c6db7b04872b961707dacfdd2c1))
- 只有在 landing 参数启用的时候才排除落地节点 ([732331c](https://github.com/powerfullz/override-rules/commit/732331cb01df08f36373bcfbd7cdabdb1b7e099b))
- 修复Mihomo Party的 Reference Error ([60e2580](https://github.com/powerfullz/override-rules/commit/60e25802f9a374440c03643da059a3521266cd04))
- 竟然不支持传参 ([128fdfe](https://github.com/powerfullz/override-rules/commit/128fdfe79c307506844004815cdf17aea557b7fa))
- 尝试修复Mihomo Party 无法覆写的问题 ([4e33d15](https://github.com/powerfullz/override-rules/commit/4e33d152d710e2b2668966c38d3dcd1aea44dd3c))
- 排除落地节点以避免循环 ([a155d1d](https://github.com/powerfullz/override-rules/commit/a155d1d352ef3e92185a09269cc385fc381f6488))
- 在 default selector 中删除落地节点避免loop ([1b3d182](https://github.com/powerfullz/override-rules/commit/1b3d18298b65336e14cefe5023df5e453a8ac340))
- 移除部分 include-all ，优化在stash下的体验 ([f2c0c37](https://github.com/powerfullz/override-rules/commit/f2c0c375d327cbf6c6e5bd9fcab6561db6ec6e58))
- Fake_proxies中添加低倍率节点以触发YAML生成 ([c959f6b](https://github.com/powerfullz/override-rules/commit/c959f6b5a94e53ef532f86dcc65f29b8b4e09674))
- 移除 PlayStoreFix 这种只有一个域名的规则 ([8bf10b0](https://github.com/powerfullz/override-rules/commit/8bf10b04849bcf456848f10c5bf081c2e73976c0))
- 尝试修复 gh actions ([233c5aa](https://github.com/powerfullz/override-rules/commit/233c5aa29cf5eb18a63c3ba325ca1222477df603))
- 更新 YAML 生成工作流，添加缺失目录检查并清理旧文件 ([726b009](https://github.com/powerfullz/override-rules/commit/726b0096aa84838a562405ef849bcddc33d5e168))
- 修正 github actions ([e676f74](https://github.com/powerfullz/override-rules/commit/e676f7402b42e3bde3c72156bcf7807d0363fe80))
- 修正 YAML 生成目录名称并添加缺失目录检查 ([903233d](https://github.com/powerfullz/override-rules/commit/903233dfb2e71fbaa02b0c82446cca62e52eac51))
- 修正 github actions 流程 ([7685543](https://github.com/powerfullz/override-rules/commit/7685543c6f1607bfa5468357d7ad40d4d08d1d10))
- 添加低倍率节点支持并调整落地节点插入位置 ([9baa096](https://github.com/powerfullz/override-rules/commit/9baa096f6b0593bea176a66e7051391cbda4300f))
- 调整落地节点在默认代理组中的位置 ([c36bc8d](https://github.com/powerfullz/override-rules/commit/c36bc8d08db265f135adf460ed6a232a5c6121a3))
- 修复默认选择器的位置 ([c7a4540](https://github.com/powerfullz/override-rules/commit/c7a4540517c166fb852cbca0a56f9ae24ed86bcd))
- 修复SpeedTest规则集链接 ([e81d370](https://github.com/powerfullz/override-rules/commit/e81d370e9c2360c710c8e23f38607c28297a7fde))
- 修复节点选择的位置 ([4f2a564](https://github.com/powerfullz/override-rules/commit/4f2a56476242ac4f6c864ea257d96c41f23f7f70))
- 清空默认回退代理组并调整代理组插入顺序 ([eae65b4](https://github.com/powerfullz/override-rules/commit/eae65b4a15f2bd265691b45356bfbddce9d002e5))
- 修复常量重新赋值 ([a45d297](https://github.com/powerfullz/override-rules/commit/a45d297c4c35a515f2b06e10744e627090ad4f4b))
- 移除自动选择选项并替换为故障转移 ([0d90f1b](https://github.com/powerfullz/override-rules/commit/0d90f1b94350736cf0d08297e1d17372f67be776))
- 更新代理组和规则 ([6b1ac3c](https://github.com/powerfullz/override-rules/commit/6b1ac3c57b773654e8e2241d66b0c55c81a37498))
- 添加 download.calibre-ebook.com 到 CDN 资源列表 ([3a01065](https://github.com/powerfullz/override-rules/commit/3a0106547caff188950139469a371d0649b0f0a3))
- Fix brave ([3724357](https://github.com/powerfullz/override-rules/commit/3724357bce0a526f97aae1e6c03ba7a45c986ef5))
- 添加 sh.nfs.pub 到 CDN 资源列表 ([0591e35](https://github.com/powerfullz/override-rules/commit/0591e35c8fbf0e09d6fab647df77c39dc31063fd))
- 添加 downloads[1-9].broadcom.com 的正则匹配到 CDN 资源列表 ([880097b](https://github.com/powerfullz/override-rules/commit/880097b5d530fcebd9cc268c8979f17c8b56732a))
- 修改低倍率节点类型为负载均衡或URL测试 ([a727310](https://github.com/powerfullz/override-rules/commit/a7273107d4a66ef1a333608ca9b6293bef5d64c2))
- 添加 include-all 参数 ([21d0400](https://github.com/powerfullz/override-rules/commit/21d040024883ace78ff46ffc949c39b41bf240a8))
- Push 到 global 节点组 ([ea7b839](https://github.com/powerfullz/override-rules/commit/ea7b8397704ed5242dbbd075a1e1ffd3ed5b946d))
- 修正图片 ([34d042f](https://github.com/powerfullz/override-rules/commit/34d042fa21f58d620eb0081b9e54bf087237394e))
- 生成国家代理组时排除落地节点 ([6a2f24a](https://github.com/powerfullz/override-rules/commit/6a2f24a0266d17d4a2a9ff03a5022810f160188a))
- 优化国家节点代理组的生成逻辑 ([2bf8979](https://github.com/powerfullz/override-rules/commit/2bf8979d2f61ac92aa6658043acd6a7babd0f10d))
- Country proxies 顺序问题（sort of） ([85882cb](https://github.com/powerfullz/override-rules/commit/85882cb1e005c0b7b8a84fa127d189f315c8487b))
- 更新 README.md，修正 Mihomo 内核描述并补充静态资源代理组说明 ([3ebdb76](https://github.com/powerfullz/override-rules/commit/3ebdb76b19c478859945994c68c3c291911a0247))
- 修正搜狗输入法规则 ([1ca56c8](https://github.com/powerfullz/override-rules/commit/1ca56c8b7b88f139078c679021adfc9c124d2214))
- 更新许可证名称为 Attribution-ShareAlike 4.0 国际公共许可证 ([caa7ca9](https://github.com/powerfullz/override-rules/commit/caa7ca9ef6c5769adf22d2f17747a868fc4ba4f4))
- 修正模式名称为小写 ([bdff21a](https://github.com/powerfullz/override-rules/commit/bdff21aabf5c143fb4d9086d5e0e1e5f81398d70))
- 移除 external-ui-url 配置项 ([8837af1](https://github.com/powerfullz/override-rules/commit/8837af1600322631b9f2ac8d11cc74cd63c1e1b3))
- 修复 global 代理组的缺失项 ([d24496a](https://github.com/powerfullz/override-rules/commit/d24496aa36b40a20783705427eff591216ae3b99))
- 修复国家列表顺序，确保节点名称正确生成 ([376580e](https://github.com/powerfullz/override-rules/commit/376580eaed120e11f03914addca19e66e5ca737e))
- 加上括号 ([9c0b9a8](https://github.com/powerfullz/override-rules/commit/9c0b9a82389b9dcb38ca0e1342c0d4b9cb336d8d))
- 修复国家顺序问题 ([380bb93](https://github.com/powerfullz/override-rules/commit/380bb93189ee73eedd30366cf8bd86af8b0a45ee))
- 修复defaultProxies is Not Defined 的问题 ([041e836](https://github.com/powerfullz/override-rules/commit/041e83631e35961b77b499f9e6b8b18e7ff0db4b))
- 修复布尔值解析逻辑，确保参数正确处理 ([10feeb3](https://github.com/powerfullz/override-rules/commit/10feeb3272d280abca74839698d9c361ef6bd5e1))
- 防止传入布尔值变成字符串 ([1352629](https://github.com/powerfullz/override-rules/commit/1352629422bda845e7c06587d2b8ec7d2317383e))
- 修复负载均衡和落地节点处理函数，简化参数传递 ([ed86512](https://github.com/powerfullz/override-rules/commit/ed8651229a89c08d7745a993c0af0e49b6f1cd7b))
- 修复常量赋值错误 ([dd7291a](https://github.com/powerfullz/override-rules/commit/dd7291a79e8665b5214fcf0eca700446aee86270))
- Comma ([c10662d](https://github.com/powerfullz/override-rules/commit/c10662dd4fe2bc2c722d17e9527c2f3e1983c338))
- 调整 Google地址集顺序以确保‘www.youtube.com’分流到 YouTube 代理组而不是 Google 代理组 ([c06fba1](https://github.com/powerfullz/override-rules/commit/c06fba18afbb141852d786f042cfae7f961e477e))
- 去除 usesystemhosts ([4cf2bf3](https://github.com/powerfullz/override-rules/commit/4cf2bf3214d7aafd566f4935e4aae085dcabb704))
- 回滚更改 ([ae23aa0](https://github.com/powerfullz/override-rules/commit/ae23aa0bb844aee39d47601f8ab6526029556f55))
- 不需要手動執行主函數 ([6159f84](https://github.com/powerfullz/override-rules/commit/6159f84fc8a24042fcd4c08ef508766c31cbdb93))
- 搞错了，是 exclude-filter ([fcaebdd](https://github.com/powerfullz/override-rules/commit/fcaebdd700116553212cac84baa18e2398352e51))
- 修正语法错误 ([9b682f4](https://github.com/powerfullz/override-rules/commit/9b682f4c3e2a1c70868ca8779d5d1479a9b3ce65))
- 更正前置代理的位置 ([9efe09e](https://github.com/powerfullz/override-rules/commit/9efe09e46ed9122795dfa03a4ab6a594874b0163))
- 添加 global 代理组缺少的项目 ([5a50bcb](https://github.com/powerfullz/override-rules/commit/5a50bcb773c200776d7d78dafbadb62174557fc0))
- 修复一些逻辑错误 ([26a81b8](https://github.com/powerfullz/override-rules/commit/26a81b8b4371ea5ee7e2badc3799477d7bfb75aa))
- 一些逻辑错误修复 ([042f916](https://github.com/powerfullz/override-rules/commit/042f916e1d9507a5cee8abf176eaa47547a11395))
- Implementing loadbalance ([fb983b8](https://github.com/powerfullz/override-rules/commit/fb983b8426b3eede084724c85bb0d047793359df))
- 修复selector ([7cdabb0](https://github.com/powerfullz/override-rules/commit/7cdabb0d83aad7548efc3586914627a933aacddd))
- 修复过滤规则 ([1952ee8](https://github.com/powerfullz/override-rules/commit/1952ee818c0aedb59dd7d55838e41adf619ee11a))
- 补上 GLOBAL 中的代理组 ([7e0cbc3](https://github.com/powerfullz/override-rules/commit/7e0cbc306e3a6328047109bcf34a19dc7fe4df7d))
- Fix ([738cab3](https://github.com/powerfullz/override-rules/commit/738cab3f612a5693a46baf687ed2534c87905229))
- 修正 GooglePlayFix.list 中的域名后缀格式 ([771f2b6](https://github.com/powerfullz/override-rules/commit/771f2b6057178413cdcd5408a6dc8e9c60f66b2f))
- 移除代理组中的谷歌FCM ([ce5ae22](https://github.com/powerfullz/override-rules/commit/ce5ae22fdc6e00cd5780349030a375fcd2e9a16a))
- 移除误杀修复规则和相关配置 ([1d3312e](https://github.com/powerfullz/override-rules/commit/1d3312edf9ee28c3849e9709186f59d962d0bf61))
- 更新代理组名称和图标，调整人工智能与 Telegram 的配置 ([9bf7456](https://github.com/powerfullz/override-rules/commit/9bf7456c46b9fc2101878a0bc1ec5548755927f0))
- 移除不必要的学术域名规则 ([8f698ff](https://github.com/powerfullz/override-rules/commit/8f698fff71923c06ef8e5c761d3c71f4f1cd30ab))
- 移除不必要的 LAN 规则 ([d0ed97c](https://github.com/powerfullz/override-rules/commit/d0ed97cd3d2f96e0a5e1233a5ad3b885189dc882))
- 更新 Telegram 规则，添加 no-resolve 选项 ([1a3d5a5](https://github.com/powerfullz/override-rules/commit/1a3d5a535769204fd4bf23820e22c770035f9dae))
- 更新 geoip 和 geosite 数据源链接，添加 mmdb 和 asn 数据源 ([0e59b48](https://github.com/powerfullz/override-rules/commit/0e59b48a43a4fb7ac1e6ca66f99c28f67ca005cb))
- 移除不必要的代理组和规则集 ([bd0430a](https://github.com/powerfullz/override-rules/commit/bd0430ac7819f069ffc9db4ebecd4f924db33864))
- 修正 YouTube 名称及相关规则集 ([52aaaa3](https://github.com/powerfullz/override-rules/commit/52aaaa353fc1b423e69152507b7567fc3a94c798))
- 修正 Telegram 名称及相关规则集 ([2866d97](https://github.com/powerfullz/override-rules/commit/2866d9710df1ff38bc992810cd2a4a1c4382107b))
- 更新 E-Hentai 图标链接 ([04905b3](https://github.com/powerfullz/override-rules/commit/04905b3f798c3eb4f6df305af898ab9a48483d3c))
- 更新 E-Hentai 图标文件 ([5230ac5](https://github.com/powerfullz/override-rules/commit/5230ac572f6b56b1281b5f13a26ccf172b34cdfc))
- 修正 E-Hentai 图标链接的大小写 ([bc3d075](https://github.com/powerfullz/override-rules/commit/bc3d0754d8c17b3df4f3b8ab91701df90547db2d))
- Delete loops ([1e05889](https://github.com/powerfullz/override-rules/commit/1e0588979fea3e69e4e0b4751ca5f9428affe683))
- Fix error ([30a1738](https://github.com/powerfullz/override-rules/commit/30a17380b389deb1cf29f859ae748ba839b38cb1))
- 替换 ghp.ci (#6) ([0698f17](https://github.com/powerfullz/override-rules/commit/0698f179802fb2f9a3a590351ffe67a75ebc5cb4))


### CI

- Update the name of CI task ([2911d3c](https://github.com/powerfullz/override-rules/commit/2911d3cd669ec1e6f93065e001a7f9386fc167ad))
- 移除推送到 Forgejo 的步骤 ([89aa0d0](https://github.com/powerfullz/override-rules/commit/89aa0d0d3bb49d59ac2b37150e71e7bb8ad31e62))


### Chores

- Bump version to 2.0.0 ([52300f3](https://github.com/powerfullz/override-rules/commit/52300f344f6261697f88c5e068eff5ca661facdb))
- Stop tracking generated artifacts ([ae96f6a](https://github.com/powerfullz/override-rules/commit/ae96f6ab43a89b24e4ecb6382682d2e8e6de755c))
- Update dependencies ([94ebc2d](https://github.com/powerfullz/override-rules/commit/94ebc2d2dabbcc402ee3a762fc36d35c7e0fc53b))
- 调整措辞 ([24a10ef](https://github.com/powerfullz/override-rules/commit/24a10efc4b0567bec111eadf66bb1907f700a566))
- Format files ([2ab9f73](https://github.com/powerfullz/override-rules/commit/2ab9f7393f7b69b0d0e67d1661cce2b11ecf4bc3))
- Format files ([d71fe34](https://github.com/powerfullz/override-rules/commit/d71fe34d3b7db1e1b0cf0ca3051b27d5d3973c84))
- 更新徽章样式 ([160b7e7](https://github.com/powerfullz/override-rules/commit/160b7e718a570d7284c37e65fd6b58306e2e84d6))
- 更新 yaml 文件 ([a1ecf0b](https://github.com/powerfullz/override-rules/commit/a1ecf0b15a109634ad2d85252fa5abad29c08a55))
- 更新低成本和落地节点的正则表达式 ([588e3fa](https://github.com/powerfullz/override-rules/commit/588e3fa19b26feadb320dd43cf48043313855c6a))
- 更新 CI 依赖 ([360e39d](https://github.com/powerfullz/override-rules/commit/360e39dac933d9f9423ae6caa2c8a64a69918bbd))
- 更新 Node.js 版本至 24 ([292e04b](https://github.com/powerfullz/override-rules/commit/292e04b8780e746cfbdf128df35a90cb757560a3))
- 更新 GitHub Actions 依赖版本 ([249027a](https://github.com/powerfullz/override-rules/commit/249027acaf291dc731d5b83f9a991ebfddb0a57c))
- Add JSDelivr badge ([ee27c00](https://github.com/powerfullz/override-rules/commit/ee27c004e406800b8a96b43144a8ebfe7144e228))
- 移除不必要的域名并优化正则表达式 ([5199d08](https://github.com/powerfullz/override-rules/commit/5199d08ab0a4da249c7333931ef4956ba5af1950))
- Add more domains ([dca3c7f](https://github.com/powerfullz/override-rules/commit/dca3c7f1ef0ee8179110e40ebb3dbd0d25d0ff78))
- Add `dl.tailscale.com` ([4578628](https://github.com/powerfullz/override-rules/commit/45786281a909b4bb720320bd91fb7c51de12b6a0))
- Optimise CI workflow ([adbdf4e](https://github.com/powerfullz/override-rules/commit/adbdf4ed0f695b6904c2b2a85bb0aef4cb4270b8))
- Optimise icons ([be3bd4e](https://github.com/powerfullz/override-rules/commit/be3bd4e524db1ff7e22d6e20d892b7b2162212fc))
- 优化分组顺序 ([a3a63f4](https://github.com/powerfullz/override-rules/commit/a3a63f4df0437a9e4f58d9d4228ecf32b4aa8455))
- Auto-generate yamls ([5569c6f](https://github.com/powerfullz/override-rules/commit/5569c6f614011b550d1de249e269a87e2edea4cb))
- Auto-generate yamls ([2dda035](https://github.com/powerfullz/override-rules/commit/2dda0357db5da2448f0af01dd60c1d14ad5971db))
- Remove TruthSocial ruleset from convert.js ([455b5f3](https://github.com/powerfullz/override-rules/commit/455b5f3d16dc8f3a0fc002c0e53fe2525ff8b7b6))
- Auto-generate yamls ([40c473b](https://github.com/powerfullz/override-rules/commit/40c473bb01562782b8a929aa8b9bc27fe51a8881))
- Auto-generate yamls ([6bcd0f9](https://github.com/powerfullz/override-rules/commit/6bcd0f9cfbe9512fdbca014a9b5f5c58893d37df))
- Auto-generate yamls ([777de24](https://github.com/powerfullz/override-rules/commit/777de2433dbeebfa074f13e5294399494869fc7d))
- Auto-generate yamls ([06cabe6](https://github.com/powerfullz/override-rules/commit/06cabe6bfcf6c0e87df3644ad54d5d1f43c4e470))
- Auto-generate yamls ([06b351d](https://github.com/powerfullz/override-rules/commit/06b351d847337281f2ab851c91ba1d5112378610))
- Auto-generate yamls ([e34d2db](https://github.com/powerfullz/override-rules/commit/e34d2dba4f6e3332061aeec2bcde8174fdf3d111))
- 优化名称 ([b5e0202](https://github.com/powerfullz/override-rules/commit/b5e02021b879a22d114f8f3e755af4ef33d02d3f))
- Auto-generate yamls ([de2cdfa](https://github.com/powerfullz/override-rules/commit/de2cdfa6dfe29a792fd2c8d0f67ae39963868501))
- Update yaml files ([bae7f2e](https://github.com/powerfullz/override-rules/commit/bae7f2e475f7827e22c640019e6c8bdd275fb71b))
- Auto-generate yamls ([31b1fe5](https://github.com/powerfullz/override-rules/commit/31b1fe53e2516ab901b5df0fb71d825dcf1dead2))
- Auto-generate yamls ([7583443](https://github.com/powerfullz/override-rules/commit/75834430b5526c1ba0c1f9790c1143f88b73fce8))
- Auto-generate yamls ([8fa6f52](https://github.com/powerfullz/override-rules/commit/8fa6f52e35a74a5ff0cca5f370b800a5f412e9e5))
- Chore：update convert.js ([696a6ab](https://github.com/powerfullz/override-rules/commit/696a6abaeea14ae87566ba2f00a5e1927b5d82d1))
- Auto-generate yamls ([0890db7](https://github.com/powerfullz/override-rules/commit/0890db76963a0bba0157f40a2b9616b5d657b899))
- 去广告规则换用性能更好的`.mrs`格式 ([18c3548](https://github.com/powerfullz/override-rules/commit/18c3548a16c99712e26e4afd400c567242b71524))
- Auto-generate yamls ([f24d20c](https://github.com/powerfullz/override-rules/commit/f24d20ca74432c0c0add67fc545be2c13debac84))
- 修改代理组配置的请求间隔时间为60秒 ([b706109](https://github.com/powerfullz/override-rules/commit/b7061096ec1ac0d9de13406da4fe8b29b2a1e3b0))
- Auto-generate yamls ([dabdba6](https://github.com/powerfullz/override-rules/commit/dabdba6dc28f30a64fde0533eb152bbb66dfab22))
- 优化 fakeip-filter ([b0c1312](https://github.com/powerfullz/override-rules/commit/b0c131221bbc899a47e3446c2c691f4b720de24a))
- Auto-generate yamls ([d8826a0](https://github.com/powerfullz/override-rules/commit/d8826a049f18d152f5034642f29d442039884423))
- Remove outdated YAML ([b4f463f](https://github.com/powerfullz/override-rules/commit/b4f463f31ea7a72f6b940e4e9ed2e41bcab4d96c))
- Auto-generate yamls ([2d4b7e0](https://github.com/powerfullz/override-rules/commit/2d4b7e0df0a096309de844fb5640b554ed043dbf))
- Auto-generate yamls ([4886ff7](https://github.com/powerfullz/override-rules/commit/4886ff798b5213824ef0a137d8b5e197dc5ad70a))
- Auto-generate yamls ([a469e04](https://github.com/powerfullz/override-rules/commit/a469e04db84c124c7584be36e8ce965bce4e6d99))
- Auto-generate yamls ([598c0d1](https://github.com/powerfullz/override-rules/commit/598c0d11e77b2b19aba87737665463893ce96633))
- Some icon optimisation ([786fdb1](https://github.com/powerfullz/override-rules/commit/786fdb19ca8d532aac9dc0834316e280b603d1be))
- Auto-generate yamls ([9b401aa](https://github.com/powerfullz/override-rules/commit/9b401aae6e91639dddc375e8ef2a9eb135e92c57))
- Auto-generate yamls ([6694ad0](https://github.com/powerfullz/override-rules/commit/6694ad0ea9dbf02ca36b68e42b61d8081c5f0b26))
- Auto-generate yamls ([a4280a7](https://github.com/powerfullz/override-rules/commit/a4280a785e2dd6c93ecfe54ae792681f744779d2))
- Auto-generate yamls ([248cb02](https://github.com/powerfullz/override-rules/commit/248cb02dac2ebcbc1aab46a62fd7cc434000f397))
- Auto-generate yamls ([22bf906](https://github.com/powerfullz/override-rules/commit/22bf906f039d2ffa7fe96da5e29c8cad4939c9af))
- Auto-generate yamls ([ad65805](https://github.com/powerfullz/override-rules/commit/ad658059ebbad97b957621d966e979a3675ed9df))
- 一些注释改进和逻辑修复 ([c617506](https://github.com/powerfullz/override-rules/commit/c617506eb425297902b936a866023ac3a8c7c3f3))
- Auto-generate yamls ([feb7e3b](https://github.com/powerfullz/override-rules/commit/feb7e3b1c5bb4c0bd158fce134e409525eea655f))
- 优化代理组顺序 ([f6394a7](https://github.com/powerfullz/override-rules/commit/f6394a73ab8b8a407c13c430af39e1225bceb231))
- Auto-generate yamls ([dff1bad](https://github.com/powerfullz/override-rules/commit/dff1badd9993327839982b034affb7306ec792fb))
- Auto-generate yamls ([a8b948c](https://github.com/powerfullz/override-rules/commit/a8b948ce11c2e2fe44387701b369109a3840bf02))
- Auto-generate yamls ([8fee978](https://github.com/powerfullz/override-rules/commit/8fee9785e772a71144d7cdbf137cf2e30c3ae101))
- Auto-generate yamls ([078d49b](https://github.com/powerfullz/override-rules/commit/078d49b2322fff6d714bf8450594b275bcb793dc))
- Auto-generate yamls ([2d04f93](https://github.com/powerfullz/override-rules/commit/2d04f934081264f6547fba1635374865d1e9394b))
- Auto-generate yamls ([aacb301](https://github.com/powerfullz/override-rules/commit/aacb301fd142dfe4de447f71cd284ee63cc11a6c))
- Auto-generate yamls ([143a4e8](https://github.com/powerfullz/override-rules/commit/143a4e848d9e04c0bb6882b783916f9d07481bfd))
- 移除 HTTP 配置中的 override-destination 选项 ([ff4aea1](https://github.com/powerfullz/override-rules/commit/ff4aea1c9b781a0e015b37c2c34479585964cf56))
- Auto-generate yamls ([fc88b95](https://github.com/powerfullz/override-rules/commit/fc88b95d55f5da6314ba5120af07de28e5dba04f))
- 再次尝试优化域名嗅探配置 ([196952a](https://github.com/powerfullz/override-rules/commit/196952a366abcff607743f26d49b98c80bd44173))
- Auto-generate yamls ([73b972e](https://github.com/powerfullz/override-rules/commit/73b972e56140272ae8d6fb18ddf9f741dad8cd04))
- 尝试优化域名嗅探配置 ([08e6d8b](https://github.com/powerfullz/override-rules/commit/08e6d8bdbe8e849ddb4e731fd3c15f2579062fbd))
- Auto-generate yamls ([0ff5608](https://github.com/powerfullz/override-rules/commit/0ff56086f5c7c554b3502675ac60826f36d0082b))
- Auto-generate yamls ([075db79](https://github.com/powerfullz/override-rules/commit/075db793f1ae36261bd214c58215a2d47fcf3c87))
- Auto-generate yamls ([67e3ec0](https://github.com/powerfullz/override-rules/commit/67e3ec0d864d3c8b6b61dced5a00da57e20023c0))
- Auto-generate yamls ([c57b3f7](https://github.com/powerfullz/override-rules/commit/c57b3f761f4e0c390c780ba5d7c71aedb705b5bc))
- 测试 actions 功能 ([fe04716](https://github.com/powerfullz/override-rules/commit/fe04716b63cc789bb6f7f173636f9c1f4fe666c8))
- 上传生成好的yamls ([727e829](https://github.com/powerfullz/override-rules/commit/727e8295f111a8029c5716d9939a661d2d8ca8fe))
- 换回cdn.jsdelivr.net ([7d62e90](https://github.com/powerfullz/override-rules/commit/7d62e909a8f14a99f0bdee877403a9c00bf14776))
- 一些小改进 ([5a26544](https://github.com/powerfullz/override-rules/commit/5a26544ca598be40d52c4640459bea9daaafc3cc))
- 优化部分规则逻辑 ([17e1756](https://github.com/powerfullz/override-rules/commit/17e175671b270647b091c6d07f9843698c9aa671))
- 一些小优化 ([de0e4cf](https://github.com/powerfullz/override-rules/commit/de0e4cf0ce5f945b55059b878a7f867e848448e5))
- 统一命名规范，微软相关规则改用 Geosite ([edc9f3c](https://github.com/powerfullz/override-rules/commit/edc9f3ccefce78aa63d9ebe2789ba6651437938a))
- 格式规范化，添加一些属性 ([ffc96eb](https://github.com/powerfullz/override-rules/commit/ffc96eb49a0bedf9c45c46977549df73db108202))
- DefaultSelector新增Direct，Play商店修复新增Google ([fc7bfb3](https://github.com/powerfullz/override-rules/commit/fc7bfb34556eca5eb7c122dad21964ad128d554a))
- 优化没必要的if分支 ([08f60e9](https://github.com/powerfullz/override-rules/commit/08f60e934ec1c0e7fdaac49ff25064e2e83fc3f6))
- 更换 JsDelivr 链接到 Fastly ([22d2073](https://github.com/powerfullz/override-rules/commit/22d2073c531d9e39d0a56f39d611207ac8a4faaf))
- 移除已经被封锁的加密DNS ([232666f](https://github.com/powerfullz/override-rules/commit/232666f608c17c148f9b7d292639c490aa1cb4b5))
- 一些小优化 ([eeaaedc](https://github.com/powerfullz/override-rules/commit/eeaaedc812c64e5492eb546525bc4389985a2fd3))
- 规则小修改 ([99e8d32](https://github.com/powerfullz/override-rules/commit/99e8d32813b34a93dd6a2663f66fe3b92489ba9d))
- 整体更新 ([5bb4a60](https://github.com/powerfullz/override-rules/commit/5bb4a6018133905b2ab204da873e404ebc239761))
- 优化一些逻辑 ([187fd52](https://github.com/powerfullz/override-rules/commit/187fd52ae23e5cae8b27cd491d9dc06dfc8010fa))
- 删除一个空格 ([f3ba61c](https://github.com/powerfullz/override-rules/commit/f3ba61cccb24f84327740f23dfbf701887e5b097))
- 更新 override.yaml 中的 DNS 增强模式并调整名称服务器配置 ([f5b1cb8](https://github.com/powerfullz/override-rules/commit/f5b1cb8524d5fe43ae57a8046a8e8f8330e099e7))
- 优化 override.yaml 中的容忍度设置，添加故障转移代理组 ([c078f91](https://github.com/powerfullz/override-rules/commit/c078f917dfba9e5d2a73719d2b8ba9c048ae6be2))
- 移除Download规则集 ([2e4f859](https://github.com/powerfullz/override-rules/commit/2e4f8595b9d911421e4179b0087f130c0c42419f))
- 更新 sniffer 配置，优化端口和目标覆盖设置 ([adbdf46](https://github.com/powerfullz/override-rules/commit/adbdf469f3b3af39124280ac08ef4d5d486d285e))
- 启用 DNS 的 IPv6 支持 ([14f8022](https://github.com/powerfullz/override-rules/commit/14f80225f7fa7625ecd359bbdc455013862b4cca))
- 移除 override.yaml 中的多个规则和提供者，优化配置 ([f1d7411](https://github.com/powerfullz/override-rules/commit/f1d74118da9d2afa2114e1d2c109137e40aca0a1))
- 移除 override_old.yaml 中的节点选择规则 ([97b9bf7](https://github.com/powerfullz/override-rules/commit/97b9bf7f8d830e6a73c12bebc2443e78cebc7fa3))
- 格式化 override.yaml，统一引号和空格 ([7f8f04c](https://github.com/powerfullz/override-rules/commit/7f8f04c18dd1e8288b7db42209ed7b5bd4781eaf))
- 移除 override.yaml 中的游戏平台相关配置，添加 SteamFix 规则集 ([f41e205](https://github.com/powerfullz/override-rules/commit/f41e2055dcc776ab319bee41915f6806756d05b4))
- 清理 override.yaml，移除不必要的规则和文件 ([bdaf916](https://github.com/powerfullz/override-rules/commit/bdaf916fdff8ceb9230d6210353d8c49f6e5b30d))
- 更换所有 testiungcf 链接为 cdn.jsdelivr.net ([0a440a2](https://github.com/powerfullz/override-rules/commit/0a440a2d126dce24dd42f14861a086caf0a06e5c))
- Update proxy domain ([163ace2](https://github.com/powerfullz/override-rules/commit/163ace2f46cd4ecbdac27883fb64f97a422c1625))


### Documentation

- Add AI agent guidelines and update build docs ([d01612b](https://github.com/powerfullz/override-rules/commit/d01612b26dc3137eb75e832eb800cbfbd09ac797))
- Update fakeip default note ([0821a46](https://github.com/powerfullz/override-rules/commit/0821a46396e13b4a0a22441d641724a1444f8718))
- 更新说明 ([d889d46](https://github.com/powerfullz/override-rules/commit/d889d46921f743ea8b3c7208d6f89f26bad17f9b))
- 更新说明 ([249b7cd](https://github.com/powerfullz/override-rules/commit/249b7cd07250a3ae9be5a26b74a8facfba6e7bc5))
- Fix sentences ([ba789fd](https://github.com/powerfullz/override-rules/commit/ba789fd3fb0f95119d25f045fceced1632418a0b))
- 调整措辞 ([937fabd](https://github.com/powerfullz/override-rules/commit/937fabdbf901a3ffada0433df52072c61693d858))
- 更新说明以更清晰地描述原始链接的使用 ([196b0a2](https://github.com/powerfullz/override-rules/commit/196b0a2e244bdb698d7df382e9e84eaf6ef9a82a))
- Update link for JSDelivr ([ea7b143](https://github.com/powerfullz/override-rules/commit/ea7b143c804386b04ff1bd3e7355a5c3cf6c75a7))
- 修正两种节点分组模式的说明，恢复 JS regex 参数文档 ([8558e19](https://github.com/powerfullz/override-rules/commit/8558e19eb3b80cfe6c2629036667ce5e8f15de0f))
- 更新 README，regex 参数已固定为 true，更新文件命名规则与示例 URL ([73bce8f](https://github.com/powerfullz/override-rules/commit/73bce8ffccc4d54925d64283859ded940fe9e364))
- Add regex param, update YAML naming scheme with quic/regex flags ([20df37e](https://github.com/powerfullz/override-rules/commit/20df37e25949eecd3cb190e6eabca059abecd5dd))
- 添加关于 fakeip 选项的描述 ([748415f](https://github.com/powerfullz/override-rules/commit/748415f92e29bfe540d472c6203f63ad04fc9ce1))
- Block quic by default ([59b7f6b](https://github.com/powerfullz/override-rules/commit/59b7f6b459d119680b6e8f4edf38d988277f3bef))
- Update readme ([e780359](https://github.com/powerfullz/override-rules/commit/e780359cdb604b7519789df56483922518f1ccca))
- Update readme ([c95d6b8](https://github.com/powerfullz/override-rules/commit/c95d6b8f654510d39c819a4f9810577141de4c13))
- Update readme ([9f707eb](https://github.com/powerfullz/override-rules/commit/9f707ebaa756bfb217023aaa810ed80c3556539d))
- Update README.md ([ad9d272](https://github.com/powerfullz/override-rules/commit/ad9d272c8eb7ca5d1a1b0f3edc3c53cb3d7c28fb))
- Update readme ([af76afd](https://github.com/powerfullz/override-rules/commit/af76afd603b68f1e7ccd34429ec7bb891bafe408))
- 优化 YAML 覆写的说明 ([4af798f](https://github.com/powerfullz/override-rules/commit/4af798fbcb7fdf525104455ec7f0bef6daa3b52e))
- 更新 readme ([fe38859](https://github.com/powerfullz/override-rules/commit/fe3885906bf3e120d4fba31e6a50242a2dbd317b))
- 更新 Readme ([5b6c2d1](https://github.com/powerfullz/override-rules/commit/5b6c2d1045415410fce79cdf063f21475d8105ad))
- 新增`keepalive`参数说明 ([d5df303](https://github.com/powerfullz/override-rules/commit/d5df3032fcc9327dcea0e715040840fd3c087cf4))
- 更新 readme ([538981d](https://github.com/powerfullz/override-rules/commit/538981d3e8c9f9f33da6cd32635dc4facf70f262))
- 更新说明 ([d71555d](https://github.com/powerfullz/override-rules/commit/d71555d484e0115d0cd511870f191d54238f0618))
- 更新使用方法，增加参数说明和示例 ([cbc2553](https://github.com/powerfullz/override-rules/commit/cbc2553e49ca75c64e01f481d9cd1b0a325eeb37))
- 更新关于 JS 覆写脚本的说明 ([b568660](https://github.com/powerfullz/override-rules/commit/b56866015752f3fc21ffb1ddeb693cf48257ce3f))
- 补充「Play 商店修复」代理组的相关说明 ([0ae27ae](https://github.com/powerfullz/override-rules/commit/0ae27aedd8a5890fe624b77803332001deeddd77))
- Update readme.md ([27dc4d3](https://github.com/powerfullz/override-rules/commit/27dc4d3460e5aaf018747f9876b4e3858c9581e2))
- 更新 README.md ([74b6ab6](https://github.com/powerfullz/override-rules/commit/74b6ab6f3717b1485a9f682d87b80539b201b478))
- 更新 README.md ([bd5cecb](https://github.com/powerfullz/override-rules/commit/bd5cecb4ad3838b3e52d51b0d7175060e4f76452))
- 更新 README.md ([352834a](https://github.com/powerfullz/override-rules/commit/352834a37e192e3462b5c4eba8217c9bda0775ba))
- Docs: 更新 README.md
fix: 修正 GooglePlayFix.list 中的域名后缀格式 ([718cf8f](https://github.com/powerfullz/override-rules/commit/718cf8f8659907181cf01499a0a5c3a57b92c5f1))


### Features

- 添加自动选择代理组 ([7fdd1a5](https://github.com/powerfullz/override-rules/commit/7fdd1a5a1e4cf45bb179d8c0b15072b693a3ec0e))
- 使用 CDN_URL 常量节省脚本体积 ([989c888](https://github.com/powerfullz/override-rules/commit/989c88834b843c97635b51fac18f15b0f002f9c5))
- 新增苹果服务代理组，移除 Onedrive 代理组 ([027268c](https://github.com/powerfullz/override-rules/commit/027268ca324e63a6f9fb8e804fe31cdfabaf4161))
- 换用更加精简的去广告规则 ([080aea1](https://github.com/powerfullz/override-rules/commit/080aea11d192e6eda84bccc7fc3030e3343d2831))
- 添加 bind-address 配置 ([aa26e74](https://github.com/powerfullz/override-rules/commit/aa26e74de34dc26603b091b03f5b05b0c05fd430))
- Add linting and formatting scripts; update dependencies ([9591fc1](https://github.com/powerfullz/override-rules/commit/9591fc16f897196d5546e21d3179f66285eab3cf))
- 新增 explicit 参数与国家代理组排序 ([35bd15c](https://github.com/powerfullz/override-rules/commit/35bd15c4a4b5d7ee9a1a5676c305d6036635f7f4))
- 优化规则顺序 ([53458e6](https://github.com/powerfullz/override-rules/commit/53458e6c5ca97da3a2e0cb6aa72fce0fac75b26f))
- 重新添加 Google、OneDrive 和 Microsoft 的代理组 ([4f5ad87](https://github.com/powerfullz/override-rules/commit/4f5ad871905223fca9529ded9bfb6f936b164595))
- 添加 Tailscale 包域名 ([f6af0d3](https://github.com/powerfullz/override-rules/commit/f6af0d306bbcb820737292e4a3b67c58e09a1d3a))
- Add intel driver domain ([b209f7a](https://github.com/powerfullz/override-rules/commit/b209f7a6f0a08fae72210e292188f9ad2adf3fb1))
- Add dotnet cdn ([49beccd](https://github.com/powerfullz/override-rules/commit/49beccdd0c36c860feac78eae254479f88e2c195))
- 添加 go 语言域名 ([c18101b](https://github.com/powerfullz/override-rules/commit/c18101b5b61be28c32526f3c067687477e612d57))
- 添加自动生成 YAML 文件的 GitHub Actions 工作流 ([ec41cd9](https://github.com/powerfullz/override-rules/commit/ec41cd905a89e197cc2fc884f4a2185e93c598a2))
- Using REJECT-DROP for better AD filtering ([3c23a0f](https://github.com/powerfullz/override-rules/commit/3c23a0f72dbbf8d1db2edda411bab086a2c517e2))
- 添加国家节点数量阈值参数 ([476b2d8](https://github.com/powerfullz/override-rules/commit/476b2d8ae026000c7a893f2e065de1d8e5fd1e57))
- 推送后自动同步到 Forgejo 实例 ([1eb55c9](https://github.com/powerfullz/override-rules/commit/1eb55c948c525333565ef900214e25d00bc73931))
- 添加 FakeIP 选项 ([d494650](https://github.com/powerfullz/override-rules/commit/d49465016001ee09b402d73b034cb9422c292a40))
- 添加 Geekbench CDN 域名 ([4ef660d](https://github.com/powerfullz/override-rules/commit/4ef660db6633eb63d4ea0e0ed5ff64a4ad463546))
- 增加重试机制 ([11f6be4](https://github.com/powerfullz/override-rules/commit/11f6be4d808b71696ab9315d28c0a7c315c8dfea))
- 添加 Spotify 相关域名到 CDN 资源列表 ([8f28954](https://github.com/powerfullz/override-rules/commit/8f28954c2689f6e094dcb695ab654d8af5eed826))
- 精简规则 ([1082439](https://github.com/powerfullz/override-rules/commit/10824392106afbc6e10854b7fa831704f40149ca))
- 为国家元数据添加国旗表情符号 ([314d91a](https://github.com/powerfullz/override-rules/commit/314d91aa86a17ad8b2dd9a0da54951570b7b921a))
- 更新 google logo ([4e632de](https://github.com/powerfullz/override-rules/commit/4e632de208a6444fd0b768984f9ad8771ebe22a8))
- 试试去掉no-resolve ([ef345eb](https://github.com/powerfullz/override-rules/commit/ef345eb0a594a32d43f6e295997afeeb884c2766))
- 尝试使用jsdmirror镜像 ([c418f3e](https://github.com/powerfullz/override-rules/commit/c418f3e27770bdd861112fae269655d112b34671))
- 实现 Github 推送自动更新 yamls ([1979359](https://github.com/powerfullz/override-rules/commit/1979359f7000c2376f598139b783ee601d890a58))
- 完成程序主体 ([14f74de](https://github.com/powerfullz/override-rules/commit/14f74de3a77e79804c8d1d274b0728f5d8b31f37))
- 尝试自动化 YAML 更新 ([d78fb9e](https://github.com/powerfullz/override-rules/commit/d78fb9ed04d4ccefde63d4956983c29853ca1398))
- 自动书写 GLOBAL 代理组 ([0193bb2](https://github.com/powerfullz/override-rules/commit/0193bb2bfd16e4daf1d7bd252a4d7dc5dfda9e71))
- 添加故障转移选项并更新图标，调整默认代理组 ([38fa002](https://github.com/powerfullz/override-rules/commit/38fa0025fa6cb35c131790c233d86ddfd42fa4a6))
- 仅为节点数大于 2 的国家创建节点组 ([acbc010](https://github.com/powerfullz/override-rules/commit/acbc0104941c76afbaccd331a78750b7d45c32ca))
- Some optimization ([211ba99](https://github.com/powerfullz/override-rules/commit/211ba995856c180408f5133379a9e904f5052df4))
- Add additional CDN resources ([8d07ffd](https://github.com/powerfullz/override-rules/commit/8d07ffd1bf84d072d95b90d1d87de16a5506a955))
- 添加update.ayugram.one ([051a3e4](https://github.com/powerfullz/override-rules/commit/051a3e45c9448a6e9931a2fb2df2fe8042246e74))
- 添加 autoupdate.termius.com 到 CDN 资源列表 ([dcd57ab](https://github.com/powerfullz/override-rules/commit/dcd57ab8a465a4aad35c4f94ec14fdfa4942d976))
- 添加低倍率节点支持，优化代理组构建逻辑 ([afd2c36](https://github.com/powerfullz/override-rules/commit/afd2c366afe1a00b943dfa3d63cadcbb1b9f330f))
- 添加开发者资源代理组及相关图标 ([a855443](https://github.com/powerfullz/override-rules/commit/a8554432e4777b621b3844423583d515314372a1))
- 添加 PayPal 代理组及相关规则, 新增 fallback dns 一个 ([874f4a9](https://github.com/powerfullz/override-rules/commit/874f4a931ca2b7ab5ea798e09ae7ece42d457a8a))
- 添加自动更新配置脚本 ([a8cdc1f](https://github.com/powerfullz/override-rules/commit/a8cdc1fdddcce5edbff1f60a241bc2294c8c9f28))
- 添加 Creative Commons 署名-非商业性-相同方式共享 4.0 国际公共许可证 ([3154e11](https://github.com/powerfullz/override-rules/commit/3154e1106e4373a51e5b9887ab3c61465e2f49cd))
- 添加 SSH(22端口) 代理支持 ([1533c07](https://github.com/powerfullz/override-rules/commit/1533c0788f155e59215996cdaacfb14c3e0101be))
- 添加 tcp-keep-alive 相关参数 ([7dabd2f](https://github.com/powerfullz/override-rules/commit/7dabd2f40ee72f50b9babe1f336ef76985d9f573))
- 添加 Apple 代理支持，移除 apple_cdn 规则 ([aa0ff9e](https://github.com/powerfullz/override-rules/commit/aa0ff9e06453a2bb0d12cb0d5ebe33d642c44e46))
- 更新 ipv6 支持描述，修正代理名称，添加 Disney 和 HBO Max 代理 ([08f8447](https://github.com/powerfullz/override-rules/commit/08f844701b232a1c341b3f418a2a1825d24aff19))
- 添加 tproxy-port 配置选项，修复 geodata-loader 错误 ([f0738e2](https://github.com/powerfullz/override-rules/commit/f0738e2561f76750e1dc02b9785c6b0240d34220))
- 添加 geodata-loader 和 external-controller 配置选项 ([a5abf94](https://github.com/powerfullz/override-rules/commit/a5abf946514a093ba543f1b718646b94bf0feb17))
- 添加 find-process-mode 配置选项 ([74e7394](https://github.com/powerfullz/override-rules/commit/74e7394d292625ed060bacfcdca76b1443e4b02a))
- 添加新浪微博、瑟琴网站、Spotify、Speedtest规则集和相关代理配置 ([f6dabc5](https://github.com/powerfullz/override-rules/commit/f6dabc53ae609cfb4f271cf3885c3c127d38dd50))
- 添加澳门、德国、法国、俄罗斯、泰国、印度和马来西亚的国家正则表达式及图标链接 ([5fb6436](https://github.com/powerfullz/override-rules/commit/5fb64363599a03389baf98d039bfabca3845847b))
- 修复莫名其妙的反向问题 ([b60fc5d](https://github.com/powerfullz/override-rules/commit/b60fc5dacb729188f61b45f245f90ac1f397e2be))
- 动态处理落地节点和前置代理的生成逻辑 ([2052c15](https://github.com/powerfullz/override-rules/commit/2052c15f9707ae49c74af62085d90e11ba5e9144))
- ProxyGroups 改为动态生成 ([94a345c](https://github.com/powerfullz/override-rules/commit/94a345cd6320738851a080fa09e087d9aec017dd))
- 重构代理组生成逻辑，动态生成国家节点并更新默认代理组 ([a5af92d](https://github.com/powerfullz/override-rules/commit/a5af92d877a43a5a372732efb47a698bff2f18cd))
- 优化一些代码逻辑，支持节点选择器的动态变更 ([4e3d8b7](https://github.com/powerfullz/override-rules/commit/4e3d8b7ad90feb64f09840f01e00a621c0fa7eab))
- 重构国家节点组生成逻辑，使用buildCountryProxies函数替代硬编码的countryProxies数组 ([1559073](https://github.com/powerfullz/override-rules/commit/1559073aa9ad62a480e967f37f63fd98bde3cc93))
- 自动根据现有节点名称生成国家代理组功能 ([557c07c](https://github.com/powerfullz/override-rules/commit/557c07c03c959c698edf469a71f87544570e4f3b))
- 重构主函数，移除addFullConfig，新增parseCountries函数以优化配置处理 ([0dba11b](https://github.com/powerfullz/override-rules/commit/0dba11b8743f164acef42378d47ab88e499d390a))
- 修改addFullConfig函数，增加config参数以支持动态配置 ([e76dff2](https://github.com/powerfullz/override-rules/commit/e76dff28b5c65f60f8d28f3475074af4b5f83137))
- 新增完整配置选项，支持纯内核启动 ([4c92d6f](https://github.com/powerfullz/override-rules/commit/4c92d6f35128dcbdf55e38051fc2858fbe2a9b32))
- 删掉「漏网之鱼」规则组，避免不必要的误会 ([59a3944](https://github.com/powerfullz/override-rules/commit/59a39447659df68f53fd3028b3e44586105055ed))
- 添加对 IPv6 支持的参数处理 ([9b73b94](https://github.com/powerfullz/override-rules/commit/9b73b94bd5c05ed6cbdd376c3336bdee1ed02bc3))
- 重构，优化可维护性 ([d28c20a](https://github.com/powerfullz/override-rules/commit/d28c20a1c92147e688be9534e5fdb50ea580f901))
- 实现落地节点功能 ([85ca362](https://github.com/powerfullz/override-rules/commit/85ca362455ae36a1e614cbdba682bfaadb11c323))
- 尝试实现落地节点功能 ([c137044](https://github.com/powerfullz/override-rules/commit/c137044bd53bf6e90b80fbe6434154adaf1fff6e))
- 优化js，支持负载均衡 ([aa01f73](https://github.com/powerfullz/override-rules/commit/aa01f73d0521a8ba073ca77f2ab43192ccf45921))
- 添加geoxurl ([99c9e5d](https://github.com/powerfullz/override-rules/commit/99c9e5dec2c2e9dd9c2f2bed4506e4d476ddc3da))
- 初版 JS 文件 ([1948060](https://github.com/powerfullz/override-rules/commit/1948060e5376300340e0a494c0dd40d2bc58209c))
- 更换广告拦截规则为 Adrules ([61e2876](https://github.com/powerfullz/override-rules/commit/61e2876732b9d473678f5d674744e32310b85c04))
- 优化国内直连规则 ([105223e](https://github.com/powerfullz/override-rules/commit/105223ec3f6a78bc6e8e5c0e81b2d9d7bf84f4ba))
- 添加苹果服务节点及相关规则 ([8376c80](https://github.com/powerfullz/override-rules/commit/8376c80b461f78c269ff37bb6a2a5ce6656b6a8a))
- 添加多个新节点，包括英国、加拿大、澳洲、欧盟和非洲节点 ([70ff7c3](https://github.com/powerfullz/override-rules/commit/70ff7c323e6655a75325ba7c52f69a8918677048))
- 添加关于 Mihomo Party DNS 和 SNI 设置的注意事项 ([b198c87](https://github.com/powerfullz/override-rules/commit/b198c875bfec34fe9fe43d388b0ae1c0d499913d))
- 更新另外三个配置 ([45f7dff](https://github.com/powerfullz/override-rules/commit/45f7dff572c6806dc678dfaf2e7adc6bc075cdd8))
- 新增额外过滤规则以屏蔽 TikTok Mod 更新提示 ([0840b78](https://github.com/powerfullz/override-rules/commit/0840b784ee40014d983e90d82a13aab322a089b7))
- 新增 Google 规则以支持访问 ([f7a9f05](https://github.com/powerfullz/override-rules/commit/f7a9f0534bb52b835bb78855c03af489258dcef5))
- 新增 TruthSocial 规则集以支持社交媒体访问 ([1885912](https://github.com/powerfullz/override-rules/commit/1885912996d80fc5f9c64f7d21d2bf53fb0beb8b))
- 新增私人节点配置以支持全球直连 ([75d42cb](https://github.com/powerfullz/override-rules/commit/75d42cb8eee64d5c4db4682e2f0fbdf126709f4f))
- 新增链式代理配置及相关说明 ([a866bfa](https://github.com/powerfullz/override-rules/commit/a866bfac320a708a825f9d0cbc283368b78c59fb))
- 移除代理组中的“落地节点”选项 ([9ffaff5](https://github.com/powerfullz/override-rules/commit/9ffaff531a42d2ebec8d5248e2a5e7bf21e4697b))
- 新增 Google 节点配置及其代理选项 ([70a1cd6](https://github.com/powerfullz/override-rules/commit/70a1cd63dc660f6baabc55b4463c5d3a08fb6f7f))
- 新增 Google 节点配置及其代理选项 ([0c21d84](https://github.com/powerfullz/override-rules/commit/0c21d84ffa573120b17077fb11c3390d2382eba1))
- 新增 Google 节点配置并更新代理组 ([1154416](https://github.com/powerfullz/override-rules/commit/115441662e2c71dba9a5b3e0fb8f9b20e5e634de))
- 更新前置代理配置，新增多个节点选项 ([9e002a4](https://github.com/powerfullz/override-rules/commit/9e002a45ab3bd7127ea3ba4c233a63c160862e28))
- 新增“落地节点”配置并更新前置代理图标 ([4094db2](https://github.com/powerfullz/override-rules/commit/4094db25288bdfabf6f3bf0173dcbb4ccccc894a))
- 将“落地资源”更改为“前置代理”以优化节点选择 ([077a7ac](https://github.com/powerfullz/override-rules/commit/077a7ac796f8899eb3d0e8549afc1de1e7b35910))
- 更新前置代理图标为机场图标 ([febe985](https://github.com/powerfullz/override-rules/commit/febe9851e6acef01fe6910d192fb523b0c878927))
- 删除落地资源配置并更新为前置代理 ([aaf03ea](https://github.com/powerfullz/override-rules/commit/aaf03ea6dc7c768c8aa4aecc5d2a06251a42eb4b))
- 新增 dialer-proxy 配置以支持落地资源 ([eb56580](https://github.com/powerfullz/override-rules/commit/eb56580178d58bef6be4cf6ab8c1d98fe386af9d))
- 新增代理组配置及规则集以支持多种网络节点选择 ([5ca64fb](https://github.com/powerfullz/override-rules/commit/5ca64fb8aac06da31af4d4776efa71d9f7f07258))
- 更新 Firebase Cloud Messaging 规则集并删除旧规则文件 ([7e9465c](https://github.com/powerfullz/override-rules/commit/7e9465c66d1fc7f60bf44cbe6d4b8fb6e8528c3d))
- 新增 tun 配置以支持流量转发和 DNS 劫持 ([6afe274](https://github.com/powerfullz/override-rules/commit/6afe2745d3c31bb19dda50c00c0d37b1adc3c7e4))
- 新增 Google FCM 规则集及相关配置 ([13c475f](https://github.com/powerfullz/override-rules/commit/13c475f040e7a69da2ea3874db30adb8d6d65453))
- 新增负载均衡版配置 ([a0dc26b](https://github.com/powerfullz/override-rules/commit/a0dc26b9b7663f756cbbe526383ee56a2203438f))
- 添加 PikPak 代理组及其图标 ([6a5fb69](https://github.com/powerfullz/override-rules/commit/6a5fb69639917ff2880eb5c0c77bb64df5940f3a))
- 添加游戏平台和Steam修复选项至override.yaml ([a75b24a](https://github.com/powerfullz/override-rules/commit/a75b24a72bf0a45ef925b26ba31ad5ab49004f8a))
- 添加加密货币规则集及相关配置 ([8873769](https://github.com/powerfullz/override-rules/commit/8873769f4c8b24031df0a914927e55048a723ff8))
- 添加 Play商店修复规则及相关图标 ([71cc99b](https://github.com/powerfullz/override-rules/commit/71cc99bc209c54beea8cc8ccc90ef70dfea612be))
- 添加 GoogleCN 规则提供者及相关规则 ([6b470ae](https://github.com/powerfullz/override-rules/commit/6b470aeebc802f37b9b15442fad27233c901463e))
- 添加 beacons.gcp.gvt2.com 到误杀规则列表 ([c2c7b46](https://github.com/powerfullz/override-rules/commit/c2c7b46506c4b26cb741253f086b694f4214d57a))
- 添加误杀修复规则集和相关配置 ([1fb387a](https://github.com/powerfullz/override-rules/commit/1fb387aa0077932276e0df97cf86bdfb604c329a))
- 移除 AppleCN 和 Telegram 相关规则，改用 GEOSITE 直接分流 ([c6ae473](https://github.com/powerfullz/override-rules/commit/c6ae473275d9648f93eb42637babf556747b1be4))
- 新增 E-Hentai 规则集及相关配置 ([b75628b](https://github.com/powerfullz/override-rules/commit/b75628b05bcc7a340ee423eef56bd07f38b68f9b))
- 添加 DNS 和 Sniffer 配置到 ACL4SSR Online Full 配置文件 ([0179f07](https://github.com/powerfullz/override-rules/commit/0179f07022adf31ae15c6c432341e19a9d836be3))
- 新增 TikTok 规则集及相关配置 ([779a3e0](https://github.com/powerfullz/override-rules/commit/779a3e0bd47227ad567334686628dd73fa3429d8))
- 新增学术网站规则集 ([129c469](https://github.com/powerfullz/override-rules/commit/129c469469fa2ffdf1e2c069253db752f78b7322))
- 将所有 DIRECT 选项替换为 全球直连 ([c305760](https://github.com/powerfullz/override-rules/commit/c30576098f1e5e3cf7b14fa98a9dd6e6193ce953))
- 新增搜狗输入 selector ([4310058](https://github.com/powerfullz/override-rules/commit/43100588b95b962d5d7a9857f9e5a8cccd62ea6d))
- 移除 reject_ip 规则提供者并更新规则集 ([3896076](https://github.com/powerfullz/override-rules/commit/389607621c80e5a33efa7eab2d86676b7c9bbf42))
- 移除 LocalAreaNetwork 规则提供者并在规则中添加 GEOIP LAN 选项 ([4be1bf0](https://github.com/powerfullz/override-rules/commit/4be1bf0b5e10954e6c126be7ea9ea6d89f4dd697))
- 在 ACL4SSR 配置中添加 GEOIP 规则以支持 DIRECT 选项 ([31d0ad8](https://github.com/powerfullz/override-rules/commit/31d0ad8cf2454d677779abe5a2bac35194e95326))
- 在代理组中添加懂王社媒选项 ([bc1349b](https://github.com/powerfullz/override-rules/commit/bc1349b83a334993237397395bd69e79f1dc7331))
- 移除代理组中的 DIRECT 选项 ([34c14f4](https://github.com/powerfullz/override-rules/commit/34c14f42eb1b0ab278e43f4abcd2438e596ebff9))
- 更新 Truth Social 规则集名称为懂王社媒 ([7238a37](https://github.com/powerfullz/override-rules/commit/7238a379350bde8f67642c91541b431714184bb9))
- 更新 ACL4SSR 配置，添加嗅探和 DNS 设置 ([5294a4f](https://github.com/powerfullz/override-rules/commit/5294a4f7968baf2a3df6aa3d6704c2febcec6987))
- 添加 Truth Social 规则集和图标 ([9b59859](https://github.com/powerfullz/override-rules/commit/9b59859408b43b6d28bb450d8c40000418c6af4c))
- 添加负载均衡代理组并更新DNS设置 ([0728d14](https://github.com/powerfullz/override-rules/commit/0728d1450c99ce73ec3840bce3f697bbf99d5f7b))


### Other

- Auto Generate Files ([e32add9](https://github.com/powerfullz/override-rules/commit/e32add91468a24762f27ae126cc6f55b64648814))
- Auto Generate Files ([d6a827f](https://github.com/powerfullz/override-rules/commit/d6a827f7715961abaffe06b52a65d2fa00f136bd))
- Auto Generate Files ([b68a259](https://github.com/powerfullz/override-rules/commit/b68a2592dc3ac672c075a7fd2f864ea4687b3f82))
- Auto Generate Files ([9eb0dda](https://github.com/powerfullz/override-rules/commit/9eb0dda910818b8c771fd87319b73e69381ca0d4))
- Auto Generate Files ([f2609be](https://github.com/powerfullz/override-rules/commit/f2609be19afb4343b11bfdb3130d0c4407ec519e))
- Auto Generate Files ([9a08a9d](https://github.com/powerfullz/override-rules/commit/9a08a9d02fbfce6cc3d31a5f0bdf1c939b1defbe))
- Auto Generate Files ([00725cf](https://github.com/powerfullz/override-rules/commit/00725cff1b6f16708178408ffc500b0880176cbf))
- Auto Generate Files ([5c687c2](https://github.com/powerfullz/override-rules/commit/5c687c2e9fd5ad2b08a15ba65a2c5a994afba215))
- Auto Generate Files ([0978d27](https://github.com/powerfullz/override-rules/commit/0978d276a067139f4773e877bcf445a928e32b0c))
- Auto Generate Files ([dbe1b4c](https://github.com/powerfullz/override-rules/commit/dbe1b4c4c271590f7c4be35a54829daf9bbaddc1))
- Auto Generate Files ([b58a35b](https://github.com/powerfullz/override-rules/commit/b58a35b9d067cd46bb54beb1b8a8bf02ad9e167f))
- Auto Generate Files ([959ba4a](https://github.com/powerfullz/override-rules/commit/959ba4a354dd4ff24e6eb140a69063902f882334))
- Auto Generate Files ([4702a05](https://github.com/powerfullz/override-rules/commit/4702a05d01f91ac363dfe1bd8c067f11018f3a19))
- Auto Generate Files ([b4c235a](https://github.com/powerfullz/override-rules/commit/b4c235a51affef47cf26cd10e34a8f27d4085832))
- Auto Generate Files ([47c35d8](https://github.com/powerfullz/override-rules/commit/47c35d89108f8a832a66d9769796f5c102e62539))
- Auto Generate Files ([d10220d](https://github.com/powerfullz/override-rules/commit/d10220dd1ea63c2a362fa8f1341498adefa05b4c))
- Auto Generate Files ([6001f59](https://github.com/powerfullz/override-rules/commit/6001f59a38d0dbc44c74bf68edc1b982d8b51dc8))
- Auto Generate Files ([f2cfd4f](https://github.com/powerfullz/override-rules/commit/f2cfd4f47a4c960dcca9ffe2e5ff992e8458e7b9))
- Update readme ([f89adc9](https://github.com/powerfullz/override-rules/commit/f89adc9e5d7115c37717a5ad1f9f1791fbfd4f7c))
- Auto Generate Files ([48abf27](https://github.com/powerfullz/override-rules/commit/48abf27a31c23362593f41ecf394d82225f48fe6))
- Auto Generate Files ([7cebaa9](https://github.com/powerfullz/override-rules/commit/7cebaa9d6ab6b25a12398f01dfbd92a6dfb15a25))
- Update readme ([2ab75f6](https://github.com/powerfullz/override-rules/commit/2ab75f68589a9af0560654813e34c2411a54e292))
- Auto Generate Files ([81c037a](https://github.com/powerfullz/override-rules/commit/81c037a0c32ff42352a09d84cc5ab678613146a8))
- Auto Generate Files ([7fbf498](https://github.com/powerfullz/override-rules/commit/7fbf498abbf01c3b8237adf6bc91644e5d8ab2aa))
- Auto Generate Files ([ed0c726](https://github.com/powerfullz/override-rules/commit/ed0c7260cb52de1ab46e451a7e421ffa97712b29))
- Auto Generate Files ([880b40b](https://github.com/powerfullz/override-rules/commit/880b40b5fa953c950254faf45311971f082c48bb))
- Auto Generate Files ([29d647b](https://github.com/powerfullz/override-rules/commit/29d647bf6c799080edd56efcbe3303a3f3c21e6d))
- Update readme ([db13a1e](https://github.com/powerfullz/override-rules/commit/db13a1ebe6c52f25262ebe86b5858b39c86bc31f))
- Update gitignore ([1b32fbd](https://github.com/powerfullz/override-rules/commit/1b32fbd8d13c32873b652eb268fcde6058d84f57))
- Update readme ([a656529](https://github.com/powerfullz/override-rules/commit/a656529704d98a6966edabe0bf6f5e9162d72fd4))
- Update readme ([7f1e9aa](https://github.com/powerfullz/override-rules/commit/7f1e9aa4eeacf9813363685cb6ab3feebefa46e6))
- Update readme ([2fcd14b](https://github.com/powerfullz/override-rules/commit/2fcd14b0a7b423ad253ec45701b51d2d8236a53a))
- Update readme ([3b50e79](https://github.com/powerfullz/override-rules/commit/3b50e79e2394e9b6804c84d4fd85f5ff27be874b))
- Auto Generate Files ([0889840](https://github.com/powerfullz/override-rules/commit/08898409780161ce8fa7e8d3ce01814b60e22df2))
- 更新 convert.js ([b39fd74](https://github.com/powerfullz/override-rules/commit/b39fd74cf56ef6c4bdc3cd520c8d7c5e86206875))
- Update convert.js ([2eba68c](https://github.com/powerfullz/override-rules/commit/2eba68c16e060c7a0d27776fa767df5b8a4affaf))
- Update convert.js ([1c4b299](https://github.com/powerfullz/override-rules/commit/1c4b29948ec289588b17ed2f8fad57d8092eab31))
- Update LICENSE ([91a99fb](https://github.com/powerfullz/override-rules/commit/91a99fb6b46ce801d9398bc91807f06a8c1a393e))
- 更新 README.md ([d55b2d7](https://github.com/powerfullz/override-rules/commit/d55b2d71d0e83577568bbf49fb44082948cff8d6))
- Update README.md ([bdc20a9](https://github.com/powerfullz/override-rules/commit/bdc20a92770ae90f8945724b1aae318049827fea))
- Update README.md ([e587c8d](https://github.com/powerfullz/override-rules/commit/e587c8d92dc3aed3690ee04a715475e0e23edfbf))
- 回滚更改 ([fa6e0c1](https://github.com/powerfullz/override-rules/commit/fa6e0c1950a211cffac91a8fd16cfbb0be6360b4))
- Revert "feat: 优化国内直连规则"

This reverts commit 105223ec3f6a78bc6e8e5c0e81b2d9d7bf84f4ba. ([a3402ba](https://github.com/powerfullz/override-rules/commit/a3402ba0bd59a7f34b72c1aefbde9b814b189a45))
- Revert "feat: 添加苹果服务节点及相关规则"

This reverts commit 8376c80b461f78c269ff37bb6a2a5ce6656b6a8a. ([d6322ce](https://github.com/powerfullz/override-rules/commit/d6322ce1d56e373d9ce6395f352878e464e78db7))
- 测试tproxy ([7552536](https://github.com/powerfullz/override-rules/commit/7552536808011dc6e94f7e6c79c2c948ffbf9cc9))
- 恢复 FCM 分组 ([4bc0bc8](https://github.com/powerfullz/override-rules/commit/4bc0bc865dba8d0b4600b20ff1c2f6d110b01432))
- Tolerance 20 ([18443da](https://github.com/powerfullz/override-rules/commit/18443da2e52e81f47a1a0e61d9081fa02e3343f3))
- Strategy consistent-hashing ([51dcf8f](https://github.com/powerfullz/override-rules/commit/51dcf8f9410af631ea26dd049f0c29f5adf579cc))
- 新增一个旧的规则用于演示 ([6d1b0fa](https://github.com/powerfullz/override-rules/commit/6d1b0fa3846b2e341301ac23415ba68f20613066))
- Update override.yaml ([26f5c18](https://github.com/powerfullz/override-rules/commit/26f5c1802f18741d71ab3861ea26182c915b010f))
- 更新 README.md，删除不必要的 JavaScript 和 YAML 文件 ([8b5007e](https://github.com/powerfullz/override-rules/commit/8b5007e4f293f54dc57bea2e897efe58bb8effc7))
- Update filename ([f50c375](https://github.com/powerfullz/override-rules/commit/f50c375028cc9203e571f5f2bc027541874e8df0))
- Update README.md ([19ed78c](https://github.com/powerfullz/override-rules/commit/19ed78c5bb84946ddff9cc5ef05bde160758139a))
- 修正图标错误 ([30beb23](https://github.com/powerfullz/override-rules/commit/30beb23e52d8d32a663626fe79a6319e0cef0ee3))
- 修正规则错误 ([a353d35](https://github.com/powerfullz/override-rules/commit/a353d35a5c98743ef964c9a746d9741ef0deeeed))
- 删去无用规则 ([0f3611e](https://github.com/powerfullz/override-rules/commit/0f3611e727f18343e3eac58d2d5c49be4f984d32))
- 引入 sukka 规则集 ([a24b0c0](https://github.com/powerfullz/override-rules/commit/a24b0c011eb7d97d5af18ac46e5c9fb2eb9fe169))
- Update dns settings ([61f022f](https://github.com/powerfullz/override-rules/commit/61f022fce16706b79a02d9d9c5082832e12c5e7d))
- Update easy_rules.yaml ([f7aa453](https://github.com/powerfullz/override-rules/commit/f7aa45367f124b4551ef204ad6d522d66d674cf8))
- Create easy_rules.yaml ([9dca202](https://github.com/powerfullz/override-rules/commit/9dca2020d071a984f2ec67eaa432466ec95ecbe0))
- Update 正则匹配设置代理组图标.js ([4196a90](https://github.com/powerfullz/override-rules/commit/4196a9070a2e03babc4b85b0d440f0551b51eb8d))
- Create 正则匹配设置代理组图标.js ([7b3d5ae](https://github.com/powerfullz/override-rules/commit/7b3d5aea425afc2a1d7d92c82c374ff43e791923))
- Update ACL4SSR_Online_Full.yaml ([af529ae](https://github.com/powerfullz/override-rules/commit/af529ae71b93cd7ffea33f686883501759b9db13))
- Update ACL4SSR_Online_Full_WithIcon.yaml ([11ca357](https://github.com/powerfullz/override-rules/commit/11ca3570d53758ac83dad2d4c83b1346efcb5750))
- Update ACL4SSR_Online_Full.yaml ([91e14b5](https://github.com/powerfullz/override-rules/commit/91e14b59565a962d6d5d37d1ec8aa0daacec545e))
- Update ACL4SSR_Online_Full_WithIcon.yaml ([eff5675](https://github.com/powerfullz/override-rules/commit/eff5675dec99f47b4b32211fba508319c5058523))
- Update ACL4SSR_Online_Full.yaml ([d83c490](https://github.com/powerfullz/override-rules/commit/d83c490a7e62da7b3356380a9cd8f07df016d9c4))
- Update ACL4SSR_Online_Full_WithIcon.yaml ([48bebb0](https://github.com/powerfullz/override-rules/commit/48bebb0f51ba538777dca0efa771e42eee83c7f5))
- Update ACL4SSR_Online_Full_WithIcon.yaml ([144dc21](https://github.com/powerfullz/override-rules/commit/144dc21e5a2596161c4c7862eb551872a0567fbc))
- Update ACL4SSR_Online_Full.yaml ([5b01d7b](https://github.com/powerfullz/override-rules/commit/5b01d7b3a62b22cf9526505adec10143e25d8e96))
- Update README.md ([f6057a4](https://github.com/powerfullz/override-rules/commit/f6057a4e5c5fc9f55511ffdedb65b5a3631cfa05))
- Create ACL4SSR_Online_Full_WithIcon.yaml ([e231f16](https://github.com/powerfullz/override-rules/commit/e231f16221bb9a23a631e8a012677ba5c962c44c))
- Update README.md ([df8ecb2](https://github.com/powerfullz/override-rules/commit/df8ecb2098f25a44b2b5018f721133d71773ee95))
- Update ACL4SSR_Online_Full.yaml ([0f0d34c](https://github.com/powerfullz/override-rules/commit/0f0d34cb0d83e09d04eee8e57c468c182cc3dd69))
- Update ACL4SSR_Online_Full.yaml ([88e0984](https://github.com/powerfullz/override-rules/commit/88e09840d89ef9a4b3700a88efe61405514e5d98))
- Create ACL4SSR_Online_Full.yaml ([4b1288c](https://github.com/powerfullz/override-rules/commit/4b1288c692bf48a8f59b377206b995b2880da5bc))
- Update 布丁狗的订阅转换.yaml ([ba37580](https://github.com/powerfullz/override-rules/commit/ba3758014fc9e52bf9eac36264a9e8cb85384433))
- Update 布丁狗的订阅转换.yaml ([7e3abc5](https://github.com/powerfullz/override-rules/commit/7e3abc5b8c8093e23d9f2d39f8b63f4eb463c869))
- Update 防止dns泄露(雾).js ([d7ee019](https://github.com/powerfullz/override-rules/commit/d7ee019aa27e25e027ea27bed3eebef60219797f))
- Create 布丁狗的订阅转换.yaml ([8aca206](https://github.com/powerfullz/override-rules/commit/8aca2062da240bc905fa46191265067cd172cfa5))
- Update 添加直连规则.yaml ([2a18fa9](https://github.com/powerfullz/override-rules/commit/2a18fa9bc8247ef5937a030e6efc7cd633d27e27))
- Update 布丁狗的订阅转换.js ([205882a](https://github.com/powerfullz/override-rules/commit/205882a466dff53e056fae51414ffe3a62530b02))
- Update ([c04b73b](https://github.com/powerfullz/override-rules/commit/c04b73b2031e9b997e28e7404e27400d8554f637))
- Update ([a498f8c](https://github.com/powerfullz/override-rules/commit/a498f8cf6eec8a2ac2bf08c3b83c18e9f2658bd1))
- Update ([0640605](https://github.com/powerfullz/override-rules/commit/0640605a2319eeb65d222990025567cd7dc0602f))
- Dns ([1ab60f1](https://github.com/powerfullz/override-rules/commit/1ab60f1b267ade92cab7aa753ca947b3a24d4870))


### Refactoring

- Migrate convert pipeline to TypeScript and dist release flow ([34fd42b](https://github.com/powerfullz/override-rules/commit/34fd42bc08ae16ab6aec545ac3a5b2cd0d245677))
- Migrate project structure to TypeScript workflow ([958fd90](https://github.com/powerfullz/override-rules/commit/958fd90ad730c5eb0bf435e44dd71c8632ad5b72))
- Migrate convert.js to modular TypeScript pipeline ([aadc041](https://github.com/powerfullz/override-rules/commit/aadc0418fc879396f176cf43aa168d00297dab35))
- Clarify defaults and front proxy order ([32d62b9](https://github.com/powerfullz/override-rules/commit/32d62b9ad8aac1ac80bd47876bf35a3a5140a1c1))
- 移除多余的空行和注释 ([9fba261](https://github.com/powerfullz/override-rules/commit/9fba261b061eee05497829737929516c005f62b6))
- 移除 GLOBAL 组生成逻辑 ([bdef066](https://github.com/powerfullz/override-rules/commit/bdef0666082d808d27c76e804e44a40194d86644))
- Read injected arguments via try/catch with fallback log ([a5b4fb8](https://github.com/powerfullz/override-rules/commit/a5b4fb8bd380428e59f38fbc9a09211c5c04e083))
- Unify proxy-group constants and reorder const declarations ([2af82d2](https://github.com/powerfullz/override-rules/commit/2af82d290ca71caa05b8951a5d6add1eec19092f))
- Replace all inline comments with JSDoc block comments ([bf3e3f8](https://github.com/powerfullz/override-rules/commit/bf3e3f86d5254c6f8192e463c8293a1537b1462d))
- Remove redundant count field from parseCountries, derive from nodes.length ([85bdd8a](https://github.com/powerfullz/override-rules/commit/85bdd8a01041d2256ef8197486d3e676a694aaeb))
- Merge hasLowCost into parseLowCost, extract LANDING constants, add parseLandingNodes with enum mode support, expand fake_proxies, add regex/quic to generator FLAGS ([64aee0d](https://github.com/powerfullz/override-rules/commit/64aee0d811b40350e443fdf062fddddd71a07ac3))
- 以枚举节点为默认行为，用 weight 替代 COUNTRY_SORT_ORDER ([752fca7](https://github.com/powerfullz/override-rules/commit/752fca779137b5d725f801d6b05290af77f0ab61))
- Optimise maintainability ([9603992](https://github.com/powerfullz/override-rules/commit/96039926b340f5b1fc11241824e4bc2a5d71d6f5))
- Optimise code for better readability ([8457a01](https://github.com/powerfullz/override-rules/commit/8457a01d55bb74f1e8e89b47888f55ee8d3a4cdc))
- 清理fake_proxies.json，只保留常用地区 ([b7e7c2c](https://github.com/powerfullz/override-rules/commit/b7e7c2ca6601088e9b39c7e0781e948d223a8679))
- 优化生成器 ([71f3333](https://github.com/powerfullz/override-rules/commit/71f3333287056c054df2ba77f4c2567132a2c9e1))
- 把图标和正则表达式放一起 ([05e8e88](https://github.com/powerfullz/override-rules/commit/05e8e887a96ac34bd89d33e2a647ba498d1dcbe2))
- 优化节点选择和故障转移逻辑，调整默认候选结构 ([e505205](https://github.com/powerfullz/override-rules/commit/e50520515808e38ddec36aa854b7745215f45810))
- 重构基础构建逻辑，优化代理组生成方式 ([6a6bf15](https://github.com/powerfullz/override-rules/commit/6a6bf1558e7fe00d505a41f1dfd102222aa6a4d1))
- 把变量都提到前面 ([e570e27](https://github.com/powerfullz/override-rules/commit/e570e278551bdd829639ebbd55339fb27b4ad599))
