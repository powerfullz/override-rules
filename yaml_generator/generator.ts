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

import {
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    unlinkSync,
    writeFileSync,
} from "node:fs";
import path from "node:path";
import process from "node:process";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

import type { ClashConfig } from "../src/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, "..");
const GENERATOR_DIR = __dirname;
const CONVERT_FILE = path.join(BASE_DIR, "convert.js");
const FAKE_PROXIES_FILE = path.join(GENERATOR_DIR, "fake_proxies.json");
const OUTPUT_DIR = path.join(BASE_DIR, "yamls");

const FLAGS = ["loadbalance", "landing", "ipv6", "full", "keepalive", "fakeip", "quic"] as const;

type FlagName = (typeof FLAGS)[number];
type FlagArgs = Record<FlagName, boolean>;
type GeneratorScriptArgs = { [K in FlagName]: boolean } & { regex: true };

interface VmSandbox extends Record<string, unknown> {
    $arguments: GeneratorScriptArgs;
    console: Console;
    main?: (config: ClashConfig) => ClashConfig;
}

const FLAG_SHORT_NAMES: Record<FlagName, string> = {
    loadbalance: "lb",
    landing: "landing",
    ipv6: "ipv6",
    full: "full",
    keepalive: "keepalive",
    fakeip: "fakeip",
    quic: "quic",
};

function loadFakeConfig(): ClashConfig {
    const raw = readFileSync(FAKE_PROXIES_FILE, "utf-8");
    const json = JSON.parse(raw) as ClashConfig;
    if (!json.proxies || !Array.isArray(json.proxies)) {
        throw new Error("fake_proxies.json 缺少 proxies 数组");
    }
    return json;
}

function toYAML(obj: ClashConfig): string {
    return YAML.stringify(obj, { indent: 2, simpleKeys: false });
}

function generateArgCombos(): FlagArgs[] {
    const combos: FlagArgs[] = [];
    for (let mask = 0; mask < 1 << FLAGS.length; mask++) {
        const combo = {} as FlagArgs;
        FLAGS.forEach((flag, i) => {
            combo[flag] = Boolean(mask & (1 << i));
        });
        combos.push(combo);
    }
    return combos;
}

function runConvert(baseConfig: ClashConfig, args: FlagArgs): ClashConfig {
    const code = readFileSync(CONVERT_FILE, "utf-8");
    const sandbox: VmSandbox = {
        $arguments: { ...args, regex: true },
        console,
    };

    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "convert.js" });

    if (typeof sandbox.main !== "function") {
        throw new Error("convert.js 未暴露 main 函数 (未在顶层定义?)");
    }

    const configCopy = JSON.parse(JSON.stringify(baseConfig)) as ClashConfig;
    return sandbox.main(configCopy);
}

function getShortName(flag: FlagName): string {
    return FLAG_SHORT_NAMES[flag];
}

function fileNameFromArgs(args: FlagArgs): string {
    const parts = FLAGS.map((flag) => `${getShortName(flag)}-${Number(args[flag])}`);
    return `config_${parts.join("_")}.yaml`;
}

function ensureDir(dirPath: string): void {
    if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
    }
}

function cleanupLegacyYamlFiles(): void {
    const flagPatterns = FLAGS.map((flag) => `${getShortName(flag)}-\\d`);
    const currentPattern = new RegExp(`^config_${flagPatterns.join("_")}\\.yaml$`);

    for (const fileName of readdirSync(OUTPUT_DIR)) {
        if (!/^config_.*\.yaml$/.test(fileName)) {
            continue;
        }
        if (currentPattern.test(fileName)) {
            continue;
        }

        try {
            unlinkSync(path.join(OUTPUT_DIR, fileName));
        } catch {
            // 忽略单文件删除失败，继续清理后续文件
        }
    }
}

function resolveLimit(total: number): number {
    const raw = process.env.LIMIT_COMBOS;
    if (!raw) return total;

    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
        return total;
    }
    return Math.min(parsed, total);
}

export function main(): void {
    if (!existsSync(CONVERT_FILE)) {
        throw new Error("未找到 convert.js，请先运行 npm run build");
    }

    const baseConfig = loadFakeConfig();
    ensureDir(OUTPUT_DIR);
    cleanupLegacyYamlFiles();

    const combos = generateArgCombos();
    const limit = resolveLimit(combos.length);
    let count = 0;

    console.log(`将生成 ${limit} 个 YAML 文件 (共 ${combos.length} 种组合)`);

    for (const args of combos) {
        if (count >= limit) break;

        const config = runConvert(baseConfig, args);
        delete config.proxies;

        const yaml = toYAML(config);
        const filePath = path.join(OUTPUT_DIR, fileNameFromArgs(args));
        writeFileSync(filePath, `${yaml}\n`, "utf-8");
        console.log(`[生成] ${path.relative(process.cwd(), filePath)}`);
        count += 1;
    }

    console.log(`完成：输出 ${count} 个 YAML 文件到 ${path.relative(process.cwd(), OUTPUT_DIR)}`);
}

try {
    main();
} catch (error) {
    console.error("生成失败:", error);
    process.exit(1);
}
