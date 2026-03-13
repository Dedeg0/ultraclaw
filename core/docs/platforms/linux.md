---
summary: "Linux support + companion app status"
read_when:
  - Looking for Linux companion app status
  - Planning platform coverage or contributions
title: "Linux App"
---

# Linux App

The Gateway is fully supported on Linux. **Node is the recommended runtime**.
Bun is not recommended for the Gateway (WhatsApp/Telegram bugs).

Native Linux companion apps are planned. Contributions are welcome if you want to help build one.

## Beginner quick path (VPS)

1. Install Node 24 (recommended; Node 22 LTS, currently `22.16+`, still works for compatibility)
2. `npm i -g ultraclaw@latest`
3. `ultraclaw onboard --install-daemon`
4. From your laptop: `ssh -N -L 18790:127.0.0.1:18790 <user>@<host>`
5. Open `http://127.0.0.1:18790/` and paste your token

Step-by-step VPS guide: [exe.dev](/install/exe-dev)

## Install

- [Getting Started](/start/getting-started)
- [Install & updates](/install/updating)
- Optional flows: [Bun (experimental)](/install/bun), [Nix](/install/nix), [Docker](/install/docker)

## Gateway

- [Gateway runbook](/gateway)
- [Configuration](/gateway/configuration)

## Gateway service install (CLI)

Use one of these:

```
ultraclaw onboard --install-daemon
```

Or:

```
ultraclaw gateway install
```

Or:

```
ultraclaw configure
```

Select **Gateway service** when prompted.

Repair/migrate:

```
ultraclaw doctor
```

## System control (systemd user unit)

UltraClaw installs a systemd **user** service by default. Use a **system**
service for shared or always-on servers. The full unit example and guidance
live in the [Gateway runbook](/gateway).

Minimal setup:

Create `~/.config/systemd/user/ultraclaw-gateway[-<profile>].service`:

```
[Unit]
Description=UltraClaw Gateway (profile: <profile>, v<version>)
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/ultraclaw gateway --port 18790
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
```

Enable it:

```
systemctl --user enable --now ultraclaw-gateway[-<profile>].service
```
