import { describe, expect, it } from "vitest";
import { isGatewayArgv, parseProcCmdline } from "./gateway-process-argv.js";

describe("parseProcCmdline", () => {
  it("splits null-delimited argv and trims empty entries", () => {
    expect(parseProcCmdline(" node \0 gateway \0\0 --port \0 18790 \0")).toEqual([
      "node",
      "gateway",
      "--port",
      "18790",
    ]);
  });
});

describe("isGatewayArgv", () => {
  it("requires a gateway token", () => {
    expect(isGatewayArgv(["node", "dist/index.js", "--port", "18790"])).toBe(false);
  });

  it("matches known entrypoints across slash and case variants", () => {
    expect(isGatewayArgv(["NODE", "C:\\UltraClaw\\DIST\\ENTRY.JS", "gateway"])).toBe(true);
    expect(isGatewayArgv(["bun", "/srv/ultraclaw/scripts/run-node.mjs", "gateway"])).toBe(true);
  });

  it("matches the ultraclaw executable but gates the gateway binary behind the opt-in flag", () => {
    expect(isGatewayArgv(["C:\\bin\\ultraclaw.cmd", "gateway"])).toBe(true);
    expect(isGatewayArgv(["/usr/local/bin/ultraclaw-gateway", "gateway"])).toBe(false);
    expect(
      isGatewayArgv(["/usr/local/bin/ultraclaw-gateway", "gateway"], {
        allowGatewayBinary: true,
      }),
    ).toBe(true);
  });
});
