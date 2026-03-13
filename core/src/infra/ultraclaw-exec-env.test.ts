import { describe, expect, it } from "vitest";
import {
  ensureUltraClawExecMarkerOnProcess,
  markUltraClawExecEnv,
  ULTRACLAW_CLI_ENV_VALUE,
  ULTRACLAW_CLI_ENV_VAR,
} from "./ultraclaw-exec-env.js";

describe("markUltraClawExecEnv", () => {
  it("returns a cloned env object with the exec marker set", () => {
    const env = { PATH: "/usr/bin", ULTRACLAW_CLI: "0" };
    const marked = markUltraClawExecEnv(env);

    expect(marked).toEqual({
      PATH: "/usr/bin",
      ULTRACLAW_CLI: ULTRACLAW_CLI_ENV_VALUE,
    });
    expect(marked).not.toBe(env);
    expect(env.ULTRACLAW_CLI).toBe("0");
  });
});

describe("ensureUltraClawExecMarkerOnProcess", () => {
  it("mutates and returns the provided process env", () => {
    const env: NodeJS.ProcessEnv = { PATH: "/usr/bin" };

    expect(ensureUltraClawExecMarkerOnProcess(env)).toBe(env);
    expect(env[ULTRACLAW_CLI_ENV_VAR]).toBe(ULTRACLAW_CLI_ENV_VALUE);
  });
});
