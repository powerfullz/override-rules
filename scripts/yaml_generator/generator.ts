/**
 * YAML 生成器
 * 使用 fake_proxies.json 中的假代理列表，载入 convert.js，
 * 组合不同参数调用其 main(config) 生成 Clash/Stash 配置，并输出为 YAML 文件。
 *
 * 支持的布尔参数在下面的 FLAGS 数组中定义，与 convert.js 内保持一致。
 * grouptype 参数（0=select, 1=url-test, 2=load-balance）控制代理组类型。
 * adblock 参数（0=关闭, 1=adrules.top, 2=217heidai, 3=AWAvenue）控制去广告规则。
 * 生成所有可能的参数组合（布尔标志 × grouptype × adblock），文件名基于参数动态生成。
 *
 * 可通过环境变量 LIMIT_COMBOS（整数）限制生成前 N 个组合。
 */

import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

import type { ClashConfig } from "../../src/types/clash";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, "../..");
const GENERATOR_DIR = __dirname;
const CONVERT_FILE = path.join(BASE_DIR, "convert.js");
const FAKE_PROXIES_FILE = path.join(GENERATOR_DIR, "fake_proxies.json");
const OUTPUT_DIR = path.join(BASE_DIR, "yamls");

const FLAGS = ["ipv6", "full", "keepalive", "fakeip", "quic", "tun"] as const;

type FlagName = (typeof FLAGS)[number];
type FlagArgs = Record<FlagName, boolean>;

const GROUPTYPE_VALUES = [0, 1, 2] as const;
type GroupTypeValue = (typeof GROUPTYPE_VALUES)[number];

const ADBLOCK_VALUES = [0, 1, 2, 3] as const;
type AdblockValue = (typeof ADBLOCK_VALUES)[number];

type GeneratorScriptArgs = { [K in FlagName]: boolean } & {
    regex: true;
    grouptype: string;
    adblock: string;
};

interface ComboArgs {
    flags: FlagArgs;
    grouptype: GroupTypeValue;
    adblock: AdblockValue;
}

interface VmSandbox extends Record<string, unknown> {
    $arguments: GeneratorScriptArgs;
    console: Console;
    main?: (config: ClashConfig) => ClashConfig;
}

/** 完成初始化的沙箱：convert.js 已暴露可用的 main 函数。 */
type ConvertContext = VmSandbox & { main: (config: ClashConfig) => ClashConfig };

async function loadFakeConfig(): Promise<ClashConfig> {
    const raw = await readFile(FAKE_PROXIES_FILE, "utf-8");
    const json = JSON.parse(raw) as ClashConfig;
    if (!Array.isArray(json.proxies)) {
        throw new Error("fake_proxies.json 缺少 proxies 数组");
    }
    return json;
}

function toYAML(obj: ClashConfig): string {
    return YAML.stringify(obj, { indent: 2, simpleKeys: false });
}

function generateArgCombos(): ComboArgs[] {
    const combos: ComboArgs[] = [];
    for (let mask = 0; mask < 1 << FLAGS.length; mask++) {
        const flags = {} as FlagArgs;
        FLAGS.forEach((flag, i) => {
            flags[flag] = Boolean(mask & (1 << i));
        });
        for (const grouptype of GROUPTYPE_VALUES) {
            for (const adblock of ADBLOCK_VALUES) {
                combos.push({ flags, grouptype, adblock });
            }
        }
    }
    return combos;
}

/** 求值 convert.js 一次；之后每个组合只替换 $arguments，避免重复读取与创建沙箱。 */
function loadConvertContext(code: string): ConvertContext {
    const sandbox: VmSandbox = {
        $arguments: {
            ipv6: false,
            full: false,
            keepalive: false,
            fakeip: false,
            quic: false,
            tun: false,
            regex: true,
            grouptype: "1",
            adblock: "0",
        },
        console,
    };

    vm.createContext(sandbox);
    // 在沙箱中执行本仓库自行构建的 convert.js 以生成 YAML，代码来源受控
    // eslint-disable-next-line sonarjs/code-eval
    vm.runInContext(code, sandbox, { filename: "convert.js" });

    if (typeof sandbox.main !== "function") {
        throw new Error("convert.js 未暴露 main 函数 (未在顶层定义?)");
    }

    return sandbox as ConvertContext;
}

function runConvert(ctx: ConvertContext, baseConfig: ClashConfig, args: ComboArgs): ClashConfig {
    ctx.$arguments = {
        ...args.flags,
        grouptype: String(args.grouptype),
        regex: true,
        adblock: String(args.adblock),
    };

    return ctx.main(structuredClone(baseConfig));
}

function fileNameFromArgs(args: ComboArgs): string {
    const flagParts = FLAGS.map((flag) => `${flag}-${Number(args.flags[flag])}`);
    return `config_gt-${args.grouptype}_adblock-${args.adblock}_${flagParts.join("_")}.yaml`;
}

async function cleanupLegacyYamlFiles(): Promise<void> {
    const flagPatterns = FLAGS.map((flag) => `${flag}-\\d`);
    const currentPattern = new RegExp(
        `^config_gt-\\d_adblock-\\d_${flagPatterns.join("_")}\\.yaml$`
    );

    for (const fileName of await readdir(OUTPUT_DIR)) {
        if (!/^config_.*\.yaml$/.test(fileName)) {
            continue;
        }
        if (currentPattern.test(fileName)) {
            continue;
        }

        try {
            await unlink(path.join(OUTPUT_DIR, fileName));
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

export async function main(): Promise<void> {
    const code = await readFile(CONVERT_FILE, "utf-8").catch((error: unknown) => {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") {
            throw new Error("未找到 convert.js，请先运行 npm run build");
        }
        throw error;
    });

    const baseConfig = await loadFakeConfig();
    const context = loadConvertContext(code);
    await mkdir(OUTPUT_DIR, { recursive: true });
    await cleanupLegacyYamlFiles();

    const combos = generateArgCombos();
    const limit = resolveLimit(combos.length);
    let count = 0;

    console.log(`将生成 ${limit} 个 YAML 文件 (共 ${combos.length} 种组合)`);

    for (const args of combos) {
        if (count >= limit) break;

        const config = runConvert(context, baseConfig, args);
        delete config.proxies;

        const yaml = toYAML(config);
        const filePath = path.join(OUTPUT_DIR, fileNameFromArgs(args));
        await writeFile(filePath, `${yaml}\n`, "utf-8");
        console.log(`[生成] ${path.relative(process.cwd(), filePath)}`);
        count += 1;
    }

    console.log(`完成：输出 ${count} 个 YAML 文件到 ${path.relative(process.cwd(), OUTPUT_DIR)}`);
}

main().catch((error: unknown) => {
    console.error("生成失败:", error);
    process.exitCode = 1;
});
