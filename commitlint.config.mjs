export default {
    extends: ["@commitlint/config-conventional"],
    // npm version 自动生成的提交只有版本号，无需符合约定式提交
    ignores: [(commit) => /^v?\d+\.\d+\.\d+$/.test(commit)],
};
