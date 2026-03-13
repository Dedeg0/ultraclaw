# UltraClaw OS

> Personal AI assistant operating system. Run AI locally on your own hardware.

Based on [OpenCLAW](https://github.com/openclaw/openclaw) (MIT License) — refactored and integrated into a bootable Linux OS.

## What is UltraClaw OS?

UltraClaw OS is Ubuntu 24.04 LTS with the UltraClaw agent system pre-installed. Boot from USB, and you have a fully configured AI assistant running locally with Ollama.

## Quick Start (installed system)

```bash
ultraclaw onboard
ultraclaw gateway --port 18790
```

## Build ISO

ISO builds automatically via GitHub Actions on every push to `main`.
Download the latest ISO from the [Actions tab](../../actions).

## Architecture

```
Channels (WhatsApp, Telegram, Discord, ...)
              │
              ▼
┌─────────────────────────────┐
│      UltraClaw Gateway      │
│   ws://127.0.0.1:18790      │
└──────────────┬──────────────┘
               │
       ┌───────┴───────┐
       │               │
  Ollama (local)   Remote APIs
  llama3.2/mistral  Anthropic/OpenAI
```

## License

MIT — based on OpenCLAW by Peter Steinberger and contributors.
