import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync("package.json", "utf-8"));
const tag = `src-v${version}`;

execSync(`npx git-cliff --tag ${tag} -o CHANGELOG.md`, { stdio: "inherit" });
