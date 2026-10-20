import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";

const cli = resolve("bin/create.js");

test("creates a valid React project", () => {
	const tempDir = mkdtempSync(join(tmpdir(), "cesarq-test-"));
	const projectName = "test-project";
	const projectDir = join(tempDir, projectName);

	try {
		const result = spawnSync(process.execPath, [cli, projectName], {
			cwd: tempDir,
			encoding: "utf8",
			timeout: 180000,
		});

		assert.equal(
			result.status,
			0,
			[
				`Initializer failed with status: ${result.status}`,
				`Error: ${result.error?.message ?? "None"}`,
				`STDOUT: \n${result.stdout ?? "(empty)"}`,
				`STDERR: \n${result.stderr ?? "(empty)"}`,
			].join("\n"),
		);

		assert.ok(existsSync(join(projectDir, "package.json")));
		assert.ok(existsSync(join(projectDir, ".gitignore")));
		assert.ok(existsSync(join(projectDir, "src", "App.tsx")));

		const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf8"));

		const lock = JSON.parse(readFileSync(join(projectDir, "package-lock.json"), "utf-8"));

		assert.equal(lock.name, projectName);
		assert.equal(lock.packages[""].name, projectName);

		assert.equal(pkg.name, projectName);

		const html = readFileSync(join(projectDir, "index.html"), "utf8");

		assert.ok(html.includes(`<title>${projectName}</title>`));

		const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

		const build = spawnSync(npmCommand, ["run", "build"], {
			cwd: projectDir,
			encoding: "utf8",
			timeout: 180000,
			shell: process.platform === "win32",
		});

		assert.equal(
			build.status,
			0,
			[
				`Build failed with status: ${build.status}`,
				`Error: ${build.error?.message ?? "None"}`,
				`STDOUT:\n${build.stdout ?? "(empty)"}`,
				`STDERR:\n${build.stderr ?? "(empty)"}`,
			].join("\n"),
		);
	} finally {
		rmSync(tempDir, { recursive: true, force: true });
	}
});

test("rejects an invalid project name", () => {
	const result = spawnSync(process.execPath, [cli, "Invalid Project Name"], {
		encoding: "utf8",
	});

	assert.notEqual(
		result.status,
		0,
		[
			"Expected the initializer to reject an invalid project name.",
			`Error: ${result.error?.message ?? "None"}`,
			`STDOUT: \n${result.stdout ?? "(empty)"}`,
			`STDERR: \n${result.stderr ?? "(empty)"}`,
		].join("\n"),
	);

	assert.match(result.stderr, /project name/i);
});

test("does not overwrite an existing directory", async () => {
	const tempDir = mkdtempSync(join(tmpdir(), "cesarq-test-"));
	const projectName = "existing-project";
	const projectDir = join(tempDir, projectName);

	try {
		const { mkdirSync, writeFileSync } = await import("node:fs");
		mkdirSync(projectDir);
		writeFileSync(join(projectDir, "keep.txt"), "preserve");

		const result = spawnSync(process.execPath, [cli, projectName], {
			cwd: tempDir,
			encoding: "utf8",
		});

		assert.notEqual(result.status, 0);
		assert.equal(readFileSync(join(projectDir, "keep.txt"), "utf8"), "preserve");
	} finally {
		rmSync(tempDir, { recursive: true, force: true });
	}
});
