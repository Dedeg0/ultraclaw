import { describe, expect, it } from "vitest";
import { resolveIrcInboundTarget } from "./monitor.js";

describe("irc monitor inbound target", () => {
  it("keeps channel target for group messages", () => {
    expect(
      resolveIrcInboundTarget({
        target: "#ultraclaw",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: true,
      target: "#ultraclaw",
      rawTarget: "#ultraclaw",
    });
  });

  it("maps DM target to sender nick and preserves raw target", () => {
    expect(
      resolveIrcInboundTarget({
        target: "ultraclaw-bot",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: false,
      target: "alice",
      rawTarget: "ultraclaw-bot",
    });
  });

  it("falls back to raw target when sender nick is empty", () => {
    expect(
      resolveIrcInboundTarget({
        target: "ultraclaw-bot",
        senderNick: " ",
      }),
    ).toEqual({
      isGroup: false,
      target: "ultraclaw-bot",
      rawTarget: "ultraclaw-bot",
    });
  });
});
