import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { captureEnv } from "../test-utils/env.js";
import {
  cleanupGlobalRenameDirs,
  detectGlobalInstallManagerByPresence,
  detectGlobalInstallManagerForRoot,
  globalInstallArgs,
  globalInstallFallbackArgs,
  resolveGlobalPackageRoot,
  resolveGlobalInstallSpec,
  resolveGlobalRoot,
  type CommandRunner,
} from "./update-global.js";

describe("update global helpers", () => {
  let envSnapshot: ReturnType<typeof captureEnv> | undefined;

  afterEach(() => {
    envSnapshot?.restore();
    envSnapshot = undefined;
  });

  it("prefers explicit package spec overrides", () => {
    envSnapshot = captureEnv(["ULTRACLAW_UPDATE_PACKAGE_SPEC"]);
    process.env.ULTRACLAW_UPDATE_PACKAGE_SPEC = "file:/tmp/ultraclaw.tgz";

    expect(resolveGlobalInstallSpec({ packageName: "ultraclaw", tag: "latest" })).toBe(
      "file:/tmp/ultraclaw.tgz",
    );
    expect(
      resolveGlobalInstallSpec({
        packageName: "ultraclaw",
        tag: "beta",
        env: { ULTRACLAW_UPDATE_PACKAGE_SPEC: "ultraclaw@next" },
      }),
    ).toBe("ultraclaw@next");
  });

  it("resolves global roots and package roots from runner output", async () => {
    const runCommand: CommandRunner = async (argv) => {
      if (argv[0] === "npm") {
        return { stdout: "/tmp/npm-root\n", stderr: "", code: 0 };
      }
      if (argv[0] === "pnpm") {
        return { stdout: "", stderr: "", code: 1 };
      }
      throw new Error(`unexpected command: ${argv.join(" ")}`);
    };

    await expect(resolveGlobalRoot("npm", runCommand, 1000)).resolves.toBe("/tmp/npm-root");
    await expect(resolveGlobalRoot("pnpm", runCommand, 1000)).resolves.toBeNull();
    await expect(resolveGlobalRoot("bun", runCommand, 1000)).resolves.toContain(
      path.join(".bun", "install", "global", "node_modules"),
    );
    await expect(resolveGlobalPackageRoot("npm", runCommand, 1000)).resolves.toBe(
      "/tmp/npm-root/ultraclaw",
    );
  });

  it("detects install managers from resolved roots and on-disk presence", async () => {
    const base = await fs.mkdtemp(path.join(os.tmpdir(), "ultraclaw-update-global-"));
    const npmRoot = path.join(base, "npm-root");
    const pnpmRoot = path.join(base, "pnpm-root");
    const bunRoot = path.join(base, ".bun", "install", "global", "node_modules");
    const pkgRoot = path.join(pnpmRoot, "ultraclaw");
    await fs.mkdir(pkgRoot, { recursive: true });
    await fs.mkdir(path.join(npmRoot, "ultraclaw"), { recursive: true });
    await fs.mkdir(path.join(bunRoot, "ultraclaw"), { recursive: true });

    envSnapshot = captureEnv(["BUN_INSTALL"]);
    process.env.BUN_INSTALL = path.join(base, ".bun");

    const runCommand: CommandRunner = async (argv) => {
      if (argv[0] === "npm") {
        return { stdout: `${npmRoot}\n`, stderr: "", code: 0 };
      }
      if (argv[0] === "pnpm") {
        return { stdout: `${pnpmRoot}\n`, stderr: "", code: 0 };
      }
      throw new Error(`unexpected command: ${argv.join(" ")}`);
    };

    await expect(detectGlobalInstallManagerForRoot(runCommand, pkgRoot, 1000)).resolves.toBe(
      "pnpm",
    );
    await expect(detectGlobalInstallManagerByPresence(runCommand, 1000)).resolves.toBe("npm");

    await fs.rm(path.join(npmRoot, "ultraclaw"), { recursive: true, force: true });
    await fs.rm(path.join(pnpmRoot, "ultraclaw"), { recursive: true, force: true });
    await expect(detectGlobalInstallManagerByPresence(runCommand, 1000)).resolves.toBe("bun");
  });

  it("builds install argv and npm fallback argv", () => {
    expect(globalInstallArgs("npm", "ultraclaw@latest")).toEqual([
      "npm",
      "i",
      "-g",
      "ultraclaw@latest",
      "--no-fund",
      "--no-audit",
      "--loglevel=error",
    ]);
    expect(globalInstallArgs("pnpm", "ultraclaw@latest")).toEqual([
      "pnpm",
      "add",
      "-g",
      "ultraclaw@latest",
    ]);
    expect(globalInstallArgs("bun", "ultraclaw@latest")).toEqual([
      "bun",
      "add",
      "-g",
      "ultraclaw@latest",
    ]);

    expect(globalInstallFallbackArgs("npm", "ultraclaw@latest")).toEqual([
      "npm",
      "i",
      "-g",
      "ultraclaw@latest",
      "--omit=optional",
      "--no-fund",
      "--no-audit",
      "--loglevel=error",
    ]);
    expect(globalInstallFallbackArgs("pnpm", "ultraclaw@latest")).toBeNull();
  });

  it("cleans only renamed package directories", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "ultraclaw-update-cleanup-"));
    await fs.mkdir(path.join(root, ".ultraclaw-123"), { recursive: true });
    await fs.mkdir(path.join(root, ".ultraclaw-456"), { recursive: true });
    await fs.writeFile(path.join(root, ".ultraclaw-file"), "nope", "utf8");
    await fs.mkdir(path.join(root, "ultraclaw"), { recursive: true });

    await expect(
      cleanupGlobalRenameDirs({
        globalRoot: root,
        packageName: "ultraclaw",
      }),
    ).resolves.toEqual({
      removed: [".ultraclaw-123", ".ultraclaw-456"],
    });
    await expect(fs.stat(path.join(root, "ultraclaw"))).resolves.toBeDefined();
    await expect(fs.stat(path.join(root, ".ultraclaw-file"))).resolves.toBeDefined();
  });
});
