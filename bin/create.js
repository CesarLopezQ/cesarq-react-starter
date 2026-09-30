#!/usr/bin/env node

import { cpSync, existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectName = process.argv[2];

if (!projectName) {
	console.error("Please provide a project name.");
	console.error("Example: npm create cesarq-starter my-project");
	process.exit(1);
}

if (!/^[a-z0-9][a-z0-9-_]*$/.test(projectName)) {
	console.error("Project name can only contain lowercase letters, numbers, hyphens, and underscores.");
	process.exit(1);
}

const targetDir = resolve(process.cwd(), projectName);
const templateDir = resolve(__dirname, "../template");
const packageJsonPath = join(targetDir, "package.json");
const indexHtmlPath = join(targetDir, "index.html");

if (existsSync(targetDir)) {
	console.error(`Directory "${projectName}" already exists.`);
	process.exit(1);
}

console.log(`Creating ${projectName}...`);

cpSync(templateDir, targetDir, { recursive: true });

renameSync(join(targetDir, "gitignore"), join(targetDir, ".gitignore"));

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
packageJson.name = projectName;

writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

let indexHtml = readFileSync(indexHtmlPath, "utf8");
indexHtml = indexHtml.replace("<title>React App</title>", `<title>${projectName}</title>`);
writeFileSync(indexHtmlPath, indexHtml);

console.log("Installing dependencies...");

const npmCommand = process.platform === "win32" ? process.env.ComSpec || "cmd.exe" : "npm";

const npmArgs = process.platform === "win32" ? ["/d", "/s", "/c", "npm install"] : ["install"];

const npmInstall = spawnSync(npmCommand, npmArgs, {
	cwd: targetDir,
	stdio: "inherit",
});

if (npmInstall.error) {
	console.error("Failed to start npm:");
	console.error(npmInstall.error);
	process.exit(1);
}

if (npmInstall.status !== 0) {
	console.error(`npm install exited with code ${npmInstall.status}.`);
	process.exit(npmInstall.status ?? 1);
}

console.log("");
console.log(`Created ${projectName}`);
console.log("");
console.log(`  cd ${projectName}`);
console.log("  npm run dev");
console.log("");
