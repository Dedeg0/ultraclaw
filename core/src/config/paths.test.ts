import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { withTempDir } from "../test-helpers/temp-dir.js";
import {
  resolveDefaultConfigCandidates,
  resolveConfigPathCandidate,
  resolveConfigPath,
  resolveOAuthDir,
  resolveOAuthPath,
  resolveStateDir,
} from "./paths.js";

describe("oauth paths", () => {
  it("prefers ULTRACLAW_OAUTH_DIR over ULTRACLAW_STATE_DIR", () => {
    const env = {
      ULTRACLAW_OAUTH_DIR: "/custom/oauth",
      ULTRACLAW_STATE_DIR: "/custom/state",
    } as NodeJS.ProcessEnv;

    expect(resolveOAuthDir(env, "/custom/state")).toBe(path.resolve("/custom/oauth"));
    expect(resolveOAuthPath(env, "/custom/state")).toBe(
      path.join(path.resolve("/custom/oauth"), "oauth.json"),
    );
  });

  it("derives oauth path from ULTRACLAW_STATE_DIR when unset", () => {
    const env = {
      ULTRACLAW_STATE_DIR: "/custom/state",
    } as NodeJS.ProcessEnv;

    expect(resolveOAuthDir(env, "/custom/state")).toBe(path.join("/custom/state", "credentials"));
    expect(resolveOAuthPath(env, "/custom/state")).toBe(
      path.join("/custom/state", "credentials", "oauth.json"),
    );
  });
});

describe("state + config path candidates", () => {
  function expectUltraClawHomeDefaults(env: NodeJS.ProcessEnv): void {
    const configuredHome = env.ULTRACLAW_HOME;
    if (!configuredHome) {
      throw new Error("ULTRACLAW_HOME must be set for this assertion helper");
    }
    const resolvedHome = path.resolve(configuredHome);
    expect(resolveStateDir(env)).toBe(path.join(resolvedHome, ".ultraclaw"));

    const candidates = resolveDefaultConfigCandidates(env);
    expect(candidates[0]).toBe(path.join(resolvedHome, ".ultraclaw", "ultraclaw.json"));
  }

  it("uses ULTRACLAW_STATE_DIR when set", () => {
    const env = {
      ULTRACLAW_STATE_DIR: "/new/state",
    } as NodeJS.ProcessEnv;

    expect(resolveStateDir(env, () => "/home/test")).toBe(path.resolve("/new/state"));
  });

  it("uses ULTRACLAW_HOME for default state/config locations", () => {
    const env = {
      ULTRACLAW_HOME: "/srv/ultraclaw-home",
    } as NodeJS.ProcessEnv;
    expectUltraClawHomeDefaults(env);
  });

  it("prefers ULTRACLAW_HOME over HOME for default state/config locations", () => {
    const env = {
      ULTRACLAW_HOME: "/srv/ultraclaw-home",
      HOME: "/home/other",
    } as NodeJS.ProcessEnv;
    expectUltraClawHomeDefaults(env);
  });

  it("orders default config candidates in a stable order", () => {
    const home = "/home/test";
    const resolvedHome = path.resolve(home);
    const candidates = resolveDefaultConfigCandidates({} as NodeJS.ProcessEnv, () => home);
    const expected = [
      path.join(resolvedHome, ".ultraclaw", "ultraclaw.json"),
      path.join(resolvedHome, ".ultraclaw", "clawdbot.json"),
      path.join(resolvedHome, ".ultraclaw", "moldbot.json"),
      path.join(resolvedHome, ".ultraclaw", "moltbot.json"),
      path.join(resolvedHome, ".clawdbot", "ultraclaw.json"),
      path.join(resolvedHome, ".clawdbot", "clawdbot.json"),
      path.join(resolvedHome, ".clawdbot", "moldbot.json"),
      path.join(resolvedHome, ".clawdbot", "moltbot.json"),
      path.join(resolvedHome, ".moldbot", "ultraclaw.json"),
      path.join(resolvedHome, ".moldbot", "clawdbot.json"),
      path.join(resolvedHome, ".moldbot", "moldbot.json"),
      path.join(resolvedHome, ".moldbot", "moltbot.json"),
      path.join(resolvedHome, ".moltbot", "ultraclaw.json"),
      path.join(resolvedHome, ".moltbot", "clawdbot.json"),
      path.join(resolvedHome, ".moltbot", "moldbot.json"),
      path.join(resolvedHome, ".moltbot", "moltbot.json"),
    ];
    expect(candidates).toEqual(expected);
  });

  it("prefers ~/.ultraclaw when it exists and legacy dir is missing", async () => {
    await withTempDir({ prefix: "ultraclaw-state-" }, async (root) => {
      const newDir = path.join(root, ".ultraclaw");
      await fs.mkdir(newDir, { recursive: true });
      const resolved = resolveStateDir({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(newDir);
    });
  });

  it("falls back to existing legacy state dir when ~/.ultraclaw is missing", async () => {
    await withTempDir({ prefix: "ultraclaw-state-legacy-" }, async (root) => {
      const legacyDir = path.join(root, ".clawdbot");
      await fs.mkdir(legacyDir, { recursive: true });
      const resolved = resolveStateDir({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(legacyDir);
    });
  });

  it("CONFIG_PATH prefers existing config when present", async () => {
    await withTempDir({ prefix: "ultraclaw-config-" }, async (root) => {
      const legacyDir = path.join(root, ".ultraclaw");
      await fs.mkdir(legacyDir, { recursive: true });
      const legacyPath = path.join(legacyDir, "ultraclaw.json");
      await fs.writeFile(legacyPath, "{}", "utf-8");

      const resolved = resolveConfigPathCandidate({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(legacyPath);
    });
  });

  it("respects state dir overrides when config is missing", async () => {
    await withTempDir({ prefix: "ultraclaw-config-override-" }, async (root) => {
      const legacyDir = path.join(root, ".ultraclaw");
      await fs.mkdir(legacyDir, { recursive: true });
      const legacyConfig = path.join(legacyDir, "ultraclaw.json");
      await fs.writeFile(legacyConfig, "{}", "utf-8");

      const overrideDir = path.join(root, "override");
      const env = { ULTRACLAW_STATE_DIR: overrideDir } as NodeJS.ProcessEnv;
      const resolved = resolveConfigPath(env, overrideDir, () => root);
      expect(resolved).toBe(path.join(overrideDir, "ultraclaw.json"));
    });
  });
});
