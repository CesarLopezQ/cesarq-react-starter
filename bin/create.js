#!/usr/bin/env node

import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
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
const packageLockPath = join(targetDir, "package-lock.json");
const indexHtmlPath = join(targetDir, "index.html");

if (existsSync(targetDir)) {
	console.error(`Directory "${projectName}" already exists.`);
	process.exit(1);
}

console.log(`Creating ${projectName}...`);

cpSync(templateDir, targetDir, { recursive: true });

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
packageJson.name = projectName;

if (existsSync(packageLockPath)) {
	const packageLock = JSON.parse(readFileSync(packageLockPath, "utf-8"));

	packageLock.name = projectName;

	if (packageLock.packages?.[""]) {
		packageLock.packages[""].name = projectName;
	}

	writeFileSync(packageLockPath, `${JSON.stringify(packageLock, null, 2)}\n`);
}

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

if (npmInstall.error || npmInstall.status !== 0) {
	console.error("\nDependency installation failed.");

	if (npmInstall.error) {
		console.error(npmInstall.error.message);
	}

	console.error(`\nYour project was created at: ${targetDir}`);

	console.error("\nTo install dependencies manually:");
	console.error(`  cd ${projectName}`);
	console.error("  npm install");

	process.exit(npmInstall.status || 1);
}

console.log("");
console.log(`Created ${projectName}`);
console.log("");
console.log(`  cd ${projectName}`);
console.log("  npm run dev");
console.log("");
