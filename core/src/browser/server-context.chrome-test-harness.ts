import { vi } from "vitest";
import { installChromeUserDataDirHooks } from "./chrome-user-data-dir.test-harness.js";

const chromeUserDataDir = { dir: "/tmp/ultraclaw" };
installChromeUserDataDirHooks(chromeUserDataDir);

vi.mock("./chrome.js", () => ({
  isChromeCdpReady: vi.fn(async () => true),
  isChromeReachable: vi.fn(async () => true),
  launchUltraClawChrome: vi.fn(async () => {
    throw new Error("unexpected launch");
  }),
  resolveUltraClawUserDataDir: vi.fn(() => chromeUserDataDir.dir),
  stopUltraClawChrome: vi.fn(async () => {}),
}));
