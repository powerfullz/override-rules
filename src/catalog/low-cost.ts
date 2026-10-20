/**
 * 低倍率节点的匹配规则。
 */

import { createCaseInsensitiveNodeMatcher } from "../utils/regex";

/** 匹配低倍率节点名称的正则（0.0~0.5 倍率、低倍率、省流、实验性）。 */
export const LOW_COST_NODE_MATCHER = createCaseInsensitiveNodeMatcher(
    String.raw`0\.[0-5]|低倍率|省流|实验性`
);
