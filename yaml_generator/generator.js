/**
 * YAML 生成器
 * 使用 fake_proxies.json 中的假代理列表，载入 convert.js，
 * 组合不同参数调用其 main(config) 生成 Clash/Stash 配置，并输出为 YAML 文件。
 *
 * 支持的布尔参数在下面的 FLAGS 数组中定义，与 convert.js 内保持一致。
 * 生成所有可能的参数组合，文件名基于参数动态生成。
 *
 * 可通过环境变量 LIMIT_COMBOS（整数）限制生成前 N 个组合。
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const YAML = require("yaml");

// 路径常量
const BASE_DIR = path.resolve(__dirname, "..");
const GENERATOR_DIR = __dirname;
const CONVERT_FILE = path.join(BASE_DIR, "convert.js");
const FAKE_PROXIES_FILE = path.join(GENERATOR_DIR, "fake_proxies.json");
const OUTPUT_DIR = path.join(BASE_DIR, "yamls");
const FLAGS = ["loadbalance", "landing", "ipv6", "full", "keepalive", "fakeip", "quic"];
// regex 恒为 true，不参与组合枚举

// 读取 fake proxies
function loadFakeConfig() {
    const raw = fs.readFileSync(FAKE_PROXIES_FILE, "utf-8");
    const json = JSON.parse(raw);
    if (!json.proxies || !Array.isArray(json.proxies)) {
        throw new Error("fake_proxies.json 缺少 proxies 数组");
    }
    return json; // 直接作为基础 config 传入 main
}

// 使用 yaml 库序列化
function toYAML(obj) {
    return YAML.stringify(obj, { indent: 2, simpleKeys: false });
}

// 生成参数组合
function generateArgCombos() {
    const combos = [];
    for (let mask = 0; mask < 1 << FLAGS.length; mask++) {
        const combo = {};
        FLAGS.forEach((flag, i) => {
            combo[flag] = Boolean(mask & (1 << i));
        });
        combos.push(combo);
    }
    return combos;
}

// 执行 convert.js 并调用 main
function runConvert(baseConfig, args) {
    const code = fs.readFileSync(CONVERT_FILE, "utf-8");
    const sandbox = {
        $arguments: { ...args, regex: true }, // regex 固定为 true
        console,
        // 为安全不提供 require / module
    };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "convert.js" });
    if (typeof sandbox.main !== "function") {
        throw new Error("convert.js 未暴露 main 函数 (未在顶层定义?)");
    }
    // 深拷贝基础配置，避免污染
    const configCopy = JSON.parse(JSON.stringify(baseConfig));
    return sandbox.main(configCopy);
}

function fileNameFromArgs(args) {
    // 根据 FLAGS 数组动态生成文件名
    const parts = FLAGS.map((flag) => {
        const shortName = getShortName(flag);
        return `${shortName}-${+args[flag]}`;
    });
    return `config_${parts.join("_")}.yaml`;
}

// 获取参数的简短名称用于文件名
function getShortName(flag) {
    const shortNames = {
        loadbalance: "lb",
        landing: "landing",
        ipv6: "ipv6",
        full: "full",
        keepalive: "keepalive",
        fakeip: "fakeip",
        quic: "quic",
    };
    return shortNames[flag] || flag;
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
    const baseConfig = loadFakeConfig();
    ensureDir(OUTPUT_DIR);
    // 清理旧文件：删除所有 config_*.yaml 中不符合当前格式的文件（包括任意旧版本格式）
    // 根据 FLAGS 数组动态生成当前格式的正则表达式
    const flagPatterns = FLAGS.map((flag) => `${getShortName(flag)}-\\d`);
    const cleanupRegex = new RegExp(`^config_${flagPatterns.join("_")}\\.yaml$`);

    for (const f of fs.readdirSync(OUTPUT_DIR)) {
        if (/^config_.*\.yaml$/.test(f) && !cleanupRegex.test(f)) {
            try {
                fs.unlinkSync(path.join(OUTPUT_DIR, f));
            } catch (_) {
                /* 忽略删除失败 */
            }
        }
    }
    const combos = generateArgCombos();
    const limit = process.env.LIMIT_COMBOS ? parseInt(process.env.LIMIT_COMBOS, 10) : combos.length;
    let count = 0;
    console.log(
        `将生成 ${Math.min(limit, combos.length)} 个 YAML 文件 (共 ${combos.length} 种组合)`
    );
    for (const args of combos) {
        if (count >= limit) break;
        const config = runConvert(baseConfig, args);
        // 输出前移除假 proxies 列表
        delete config.proxies;
        const yaml = toYAML(config);
        const filePath = path.join(OUTPUT_DIR, fileNameFromArgs(args));
        fs.writeFileSync(filePath, yaml + "\n", "utf-8");
        console.log(`[生成] ${path.relative(process.cwd(), filePath)}`);
        count++;
    }
    console.log(`完成：输出 ${count} 个 YAML 文件到 ${path.relative(process.cwd(), OUTPUT_DIR)}`);
}

if (require.main === module) {
    try {
        main();
    } catch (e) {
        console.error("生成失败:", e);
        process.exit(1);
    }
}
