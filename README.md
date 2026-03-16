# UltraClaw

> A personal AI assistant that runs entirely on your own hardware.

Based on [OpenCLAW](https://github.com/openclaw/openclaw) (MIT License).

## What is UltraClaw?

UltraClaw is a self-hosted AI assistant. It connects to local AI models via [Ollama](https://ollama.com) or remote APIs (Anthropic, OpenAI), and lets you chat through a web interface or messaging apps like WhatsApp, Telegram, and Discord.

Everything runs on your machine. Your conversations stay private.

## The easiest way to run UltraClaw

Download **[UltraClaw OS](https://github.com/Dedeg0/ultraclaw-os/releases)** — a bootable USB image with everything pre-installed and configured.

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

## Quick start (installed system)

```bash
ultraclaw onboard
ultraclaw gateway --port 18790
```

Then open `http://localhost:18790` in your browser.

## Supported AI models

| Provider | Models |
|----------|--------|
| Ollama (local) | llama3.2, mistral, phi3, and any model from [ollama.com/library](https://ollama.com/library) |
| Anthropic | Claude Sonnet, Claude Opus |
| OpenAI | GPT-4o, GPT-4 |

## Supported channels

- WhatsApp
- Telegram
- Discord
- Slack
- iMessage
- Signal
- Web interface

## Requirements

- Node.js 22+
- Linux, macOS, or Windows (WSL)
- 8 GB RAM minimum (16 GB recommended for local models)

## License

MIT — based on OpenCLAW by Peter Steinberger and contributors.