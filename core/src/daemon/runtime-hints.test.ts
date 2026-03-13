import { describe, expect, it } from "vitest";
import { buildPlatformRuntimeLogHints, buildPlatformServiceStartHints } from "./runtime-hints.js";

describe("buildPlatformRuntimeLogHints", () => {
  it("renders launchd log hints on darwin", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "darwin",
        env: {
          ULTRACLAW_STATE_DIR: "/tmp/ultraclaw-state",
          ULTRACLAW_LOG_PREFIX: "gateway",
        },
        systemdServiceName: "ultraclaw-gateway",
        windowsTaskName: "UltraClaw Gateway",
      }),
    ).toEqual([
      "Launchd stdout (if installed): /tmp/ultraclaw-state/logs/gateway.log",
      "Launchd stderr (if installed): /tmp/ultraclaw-state/logs/gateway.err.log",
    ]);
  });

  it("renders systemd and windows hints by platform", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "linux",
        systemdServiceName: "ultraclaw-gateway",
        windowsTaskName: "UltraClaw Gateway",
      }),
    ).toEqual(["Logs: journalctl --user -u ultraclaw-gateway.service -n 200 --no-pager"]);
    expect(
      buildPlatformRuntimeLogHints({
        platform: "win32",
        systemdServiceName: "ultraclaw-gateway",
        windowsTaskName: "UltraClaw Gateway",
      }),
    ).toEqual(['Logs: schtasks /Query /TN "UltraClaw Gateway" /V /FO LIST']);
  });
});

describe("buildPlatformServiceStartHints", () => {
  it("builds platform-specific service start hints", () => {
    expect(
      buildPlatformServiceStartHints({
        platform: "darwin",
        installCommand: "ultraclaw gateway install",
        startCommand: "ultraclaw gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.ultraclaw.gateway.plist",
        systemdServiceName: "ultraclaw-gateway",
        windowsTaskName: "UltraClaw Gateway",
      }),
    ).toEqual([
      "ultraclaw gateway install",
      "ultraclaw gateway",
      "launchctl bootstrap gui/$UID ~/Library/LaunchAgents/com.ultraclaw.gateway.plist",
    ]);
    expect(
      buildPlatformServiceStartHints({
        platform: "linux",
        installCommand: "ultraclaw gateway install",
        startCommand: "ultraclaw gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.ultraclaw.gateway.plist",
        systemdServiceName: "ultraclaw-gateway",
        windowsTaskName: "UltraClaw Gateway",
      }),
    ).toEqual([
      "ultraclaw gateway install",
      "ultraclaw gateway",
      "systemctl --user start ultraclaw-gateway.service",
    ]);
  });
});
