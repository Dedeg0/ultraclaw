---
summary: "CLI reference for `ultraclaw voicecall` (voice-call plugin command surface)"
read_when:
  - You use the voice-call plugin and want the CLI entry points
  - You want quick examples for `voicecall call|continue|status|tail|expose`
title: "voicecall"
---

# `ultraclaw voicecall`

`voicecall` is a plugin-provided command. It only appears if the voice-call plugin is installed and enabled.

Primary doc:

- Voice-call plugin: [Voice Call](/plugins/voice-call)

## Common commands

```bash
ultraclaw voicecall status --call-id <id>
ultraclaw voicecall call --to "+15555550123" --message "Hello" --mode notify
ultraclaw voicecall continue --call-id <id> --message "Any questions?"
ultraclaw voicecall end --call-id <id>
```

## Exposing webhooks (Tailscale)

```bash
ultraclaw voicecall expose --mode serve
ultraclaw voicecall expose --mode funnel
ultraclaw voicecall expose --mode off
```

Security note: only expose the webhook endpoint to networks you trust. Prefer Tailscale Serve over Funnel when possible.
