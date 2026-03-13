import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "ultraclaw",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "ultraclaw", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "ultraclaw", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "ultraclaw", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "ultraclaw", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "ultraclaw", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "ultraclaw", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it.each([
    ["--dev first", ["node", "ultraclaw", "--dev", "--profile", "work", "status"]],
    ["--profile first", ["node", "ultraclaw", "--profile", "work", "--dev", "status"]],
  ])("rejects combining --dev with --profile (%s)", (_name, argv) => {
    const res = parseCliProfileArgs(argv);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join(path.resolve("/home/peter"), ".ultraclaw-dev");
    expect(env.ULTRACLAW_PROFILE).toBe("dev");
    expect(env.ULTRACLAW_STATE_DIR).toBe(expectedStateDir);
    expect(env.ULTRACLAW_CONFIG_PATH).toBe(path.join(expectedStateDir, "ultraclaw.json"));
    expect(env.ULTRACLAW_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      ULTRACLAW_STATE_DIR: "/custom",
      ULTRACLAW_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.ULTRACLAW_STATE_DIR).toBe("/custom");
    expect(env.ULTRACLAW_GATEWAY_PORT).toBe("19099");
    expect(env.ULTRACLAW_CONFIG_PATH).toBe(path.join("/custom", "ultraclaw.json"));
  });

  it("uses ULTRACLAW_HOME when deriving profile state dir", () => {
    const env: Record<string, string | undefined> = {
      ULTRACLAW_HOME: "/srv/ultraclaw-home",
      HOME: "/home/other",
    };
    applyCliProfileEnv({
      profile: "work",
      env,
      homedir: () => "/home/fallback",
    });

    const resolvedHome = path.resolve("/srv/ultraclaw-home");
    expect(env.ULTRACLAW_STATE_DIR).toBe(path.join(resolvedHome, ".ultraclaw-work"));
    expect(env.ULTRACLAW_CONFIG_PATH).toBe(
      path.join(resolvedHome, ".ultraclaw-work", "ultraclaw.json"),
    );
  });
});

describe("formatCliCommand", () => {
  it.each([
    {
      name: "no profile is set",
      cmd: "ultraclaw doctor --fix",
      env: {},
      expected: "ultraclaw doctor --fix",
    },
    {
      name: "profile is default",
      cmd: "ultraclaw doctor --fix",
      env: { ULTRACLAW_PROFILE: "default" },
      expected: "ultraclaw doctor --fix",
    },
    {
      name: "profile is Default (case-insensitive)",
      cmd: "ultraclaw doctor --fix",
      env: { ULTRACLAW_PROFILE: "Default" },
      expected: "ultraclaw doctor --fix",
    },
    {
      name: "profile is invalid",
      cmd: "ultraclaw doctor --fix",
      env: { ULTRACLAW_PROFILE: "bad profile" },
      expected: "ultraclaw doctor --fix",
    },
    {
      name: "--profile is already present",
      cmd: "ultraclaw --profile work doctor --fix",
      env: { ULTRACLAW_PROFILE: "work" },
      expected: "ultraclaw --profile work doctor --fix",
    },
    {
      name: "--dev is already present",
      cmd: "ultraclaw --dev doctor",
      env: { ULTRACLAW_PROFILE: "dev" },
      expected: "ultraclaw --dev doctor",
    },
  ])("returns command unchanged when $name", ({ cmd, env, expected }) => {
    expect(formatCliCommand(cmd, env)).toBe(expected);
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("ultraclaw doctor --fix", { ULTRACLAW_PROFILE: "work" })).toBe(
      "ultraclaw --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("ultraclaw doctor --fix", { ULTRACLAW_PROFILE: "  jbultraclaw  " })).toBe(
      "ultraclaw --profile jbultraclaw doctor --fix",
    );
  });

  it("handles command with no args after ultraclaw", () => {
    expect(formatCliCommand("ultraclaw", { ULTRACLAW_PROFILE: "test" })).toBe(
      "ultraclaw --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm ultraclaw doctor", { ULTRACLAW_PROFILE: "work" })).toBe(
      "pnpm ultraclaw --profile work doctor",
    );
  });
});
