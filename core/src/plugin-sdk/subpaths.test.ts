import * as compatSdk from "ultraclaw/plugin-sdk/compat";
import * as discordSdk from "ultraclaw/plugin-sdk/discord";
import * as imessageSdk from "ultraclaw/plugin-sdk/imessage";
import * as lineSdk from "ultraclaw/plugin-sdk/line";
import * as msteamsSdk from "ultraclaw/plugin-sdk/msteams";
import * as signalSdk from "ultraclaw/plugin-sdk/signal";
import * as slackSdk from "ultraclaw/plugin-sdk/slack";
import * as telegramSdk from "ultraclaw/plugin-sdk/telegram";
import * as whatsappSdk from "ultraclaw/plugin-sdk/whatsapp";
import { describe, expect, it } from "vitest";

const bundledExtensionSubpathLoaders = [
  { id: "acpx", load: () => import("ultraclaw/plugin-sdk/acpx") },
  { id: "bluebubbles", load: () => import("ultraclaw/plugin-sdk/bluebubbles") },
  { id: "copilot-proxy", load: () => import("ultraclaw/plugin-sdk/copilot-proxy") },
  { id: "device-pair", load: () => import("ultraclaw/plugin-sdk/device-pair") },
  { id: "diagnostics-otel", load: () => import("ultraclaw/plugin-sdk/diagnostics-otel") },
  { id: "diffs", load: () => import("ultraclaw/plugin-sdk/diffs") },
  { id: "feishu", load: () => import("ultraclaw/plugin-sdk/feishu") },
  {
    id: "google-gemini-cli-auth",
    load: () => import("ultraclaw/plugin-sdk/google-gemini-cli-auth"),
  },
  { id: "googlechat", load: () => import("ultraclaw/plugin-sdk/googlechat") },
  { id: "irc", load: () => import("ultraclaw/plugin-sdk/irc") },
  { id: "llm-task", load: () => import("ultraclaw/plugin-sdk/llm-task") },
  { id: "lobster", load: () => import("ultraclaw/plugin-sdk/lobster") },
  { id: "matrix", load: () => import("ultraclaw/plugin-sdk/matrix") },
  { id: "mattermost", load: () => import("ultraclaw/plugin-sdk/mattermost") },
  { id: "memory-core", load: () => import("ultraclaw/plugin-sdk/memory-core") },
  { id: "memory-lancedb", load: () => import("ultraclaw/plugin-sdk/memory-lancedb") },
  {
    id: "minimax-portal-auth",
    load: () => import("ultraclaw/plugin-sdk/minimax-portal-auth"),
  },
  { id: "nextcloud-talk", load: () => import("ultraclaw/plugin-sdk/nextcloud-talk") },
  { id: "nostr", load: () => import("ultraclaw/plugin-sdk/nostr") },
  { id: "open-prose", load: () => import("ultraclaw/plugin-sdk/open-prose") },
  { id: "phone-control", load: () => import("ultraclaw/plugin-sdk/phone-control") },
  { id: "qwen-portal-auth", load: () => import("ultraclaw/plugin-sdk/qwen-portal-auth") },
  { id: "synology-chat", load: () => import("ultraclaw/plugin-sdk/synology-chat") },
  { id: "talk-voice", load: () => import("ultraclaw/plugin-sdk/talk-voice") },
  { id: "test-utils", load: () => import("ultraclaw/plugin-sdk/test-utils") },
  { id: "thread-ownership", load: () => import("ultraclaw/plugin-sdk/thread-ownership") },
  { id: "tlon", load: () => import("ultraclaw/plugin-sdk/tlon") },
  { id: "twitch", load: () => import("ultraclaw/plugin-sdk/twitch") },
  { id: "voice-call", load: () => import("ultraclaw/plugin-sdk/voice-call") },
  { id: "zalo", load: () => import("ultraclaw/plugin-sdk/zalo") },
  { id: "zalouser", load: () => import("ultraclaw/plugin-sdk/zalouser") },
] as const;

describe("plugin-sdk subpath exports", () => {
  it("exports compat helpers", () => {
    expect(typeof compatSdk.emptyPluginConfigSchema).toBe("function");
    expect(typeof compatSdk.resolveControlCommandGate).toBe("function");
  });

  it("exports Discord helpers", () => {
    expect(typeof discordSdk.resolveDiscordAccount).toBe("function");
    expect(typeof discordSdk.inspectDiscordAccount).toBe("function");
    expect(typeof discordSdk.discordOnboardingAdapter).toBe("object");
  });

  it("exports Slack helpers", () => {
    expect(typeof slackSdk.resolveSlackAccount).toBe("function");
    expect(typeof slackSdk.inspectSlackAccount).toBe("function");
    expect(typeof slackSdk.handleSlackMessageAction).toBe("function");
  });

  it("exports Telegram helpers", () => {
    expect(typeof telegramSdk.resolveTelegramAccount).toBe("function");
    expect(typeof telegramSdk.inspectTelegramAccount).toBe("function");
    expect(typeof telegramSdk.telegramOnboardingAdapter).toBe("object");
  });

  it("exports Signal helpers", () => {
    expect(typeof signalSdk.resolveSignalAccount).toBe("function");
    expect(typeof signalSdk.signalOnboardingAdapter).toBe("object");
  });

  it("exports iMessage helpers", () => {
    expect(typeof imessageSdk.resolveIMessageAccount).toBe("function");
    expect(typeof imessageSdk.imessageOnboardingAdapter).toBe("object");
  });

  it("exports WhatsApp helpers", () => {
    expect(typeof whatsappSdk.resolveWhatsAppAccount).toBe("function");
    expect(typeof whatsappSdk.whatsappOnboardingAdapter).toBe("object");
  });

  it("exports LINE helpers", () => {
    expect(typeof lineSdk.processLineMessage).toBe("function");
    expect(typeof lineSdk.createInfoCard).toBe("function");
  });

  it("exports Microsoft Teams helpers", () => {
    expect(typeof msteamsSdk.resolveControlCommandGate).toBe("function");
    expect(typeof msteamsSdk.loadOutboundMediaFromUrl).toBe("function");
  });

  it("exports acpx helpers", async () => {
    const acpxSdk = await import("ultraclaw/plugin-sdk/acpx");
    expect(typeof acpxSdk.listKnownProviderAuthEnvVarNames).toBe("function");
    expect(typeof acpxSdk.omitEnvKeysCaseInsensitive).toBe("function");
  });

  it("resolves bundled extension subpaths", async () => {
    for (const { id, load } of bundledExtensionSubpathLoaders) {
      const mod = await load();
      expect(typeof mod).toBe("object");
      expect(mod, `subpath ${id} should resolve`).toBeTruthy();
    }
  });

  it("keeps the newly added bundled plugin-sdk contracts available", async () => {
    const bluebubbles = await import("ultraclaw/plugin-sdk/bluebubbles");
    expect(typeof bluebubbles.parseFiniteNumber).toBe("function");

    const mattermost = await import("ultraclaw/plugin-sdk/mattermost");
    expect(typeof mattermost.parseStrictPositiveInteger).toBe("function");

    const nextcloudTalk = await import("ultraclaw/plugin-sdk/nextcloud-talk");
    expect(typeof nextcloudTalk.waitForAbortSignal).toBe("function");

    const twitch = await import("ultraclaw/plugin-sdk/twitch");
    expect(typeof twitch.DEFAULT_ACCOUNT_ID).toBe("string");
    expect(typeof twitch.normalizeAccountId).toBe("function");
  });
});
