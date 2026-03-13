---
summary: "Uninstall UltraClaw completely (CLI, service, state, workspace)"
read_when:
  - You want to remove UltraClaw from a machine
  - The gateway service is still running after uninstall
title: "Uninstall"
---

# Uninstall

Two paths:

- **Easy path** if `ultraclaw` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
ultraclaw uninstall
```

Non-interactive (automation / npx):

```bash
ultraclaw uninstall --all --yes --non-interactive
npx -y ultraclaw uninstall --all --yes --non-interactive
```

Manual steps (same result):

1. Stop the gateway service:

```bash
ultraclaw gateway stop
```

2. Uninstall the gateway service (launchd/systemd/schtasks):

```bash
ultraclaw gateway uninstall
```

3. Delete state + config:

```bash
rm -rf "${ULTRACLAW_STATE_DIR:-$HOME/.ultraclaw}"
```

If you set `ULTRACLAW_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4. Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/.ultraclaw/workspace
```

5. Remove the CLI install (pick the one you used):

```bash
npm rm -g ultraclaw
pnpm remove -g ultraclaw
bun remove -g ultraclaw
```

6. If you installed the macOS app:

```bash
rm -rf /Applications/UltraClaw.app
```

Notes:

- If you used profiles (`--profile` / `ULTRACLAW_PROFILE`), repeat step 3 for each state dir (defaults are `~/.ultraclaw-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `ultraclaw` is missing.

### macOS (launchd)

Default label is `ai.ultraclaw.gateway` (or `ai.ultraclaw.<profile>`; legacy `com.ultraclaw.*` may still exist):

```bash
launchctl bootout gui/$UID/ai.ultraclaw.gateway
rm -f ~/Library/LaunchAgents/ai.ultraclaw.gateway.plist
```

If you used a profile, replace the label and plist name with `ai.ultraclaw.<profile>`. Remove any legacy `com.ultraclaw.*` plists if present.

### Linux (systemd user unit)

Default unit name is `ultraclaw-gateway.service` (or `ultraclaw-gateway-<profile>.service`):

```bash
systemctl --user disable --now ultraclaw-gateway.service
rm -f ~/.config/systemd/user/ultraclaw-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `UltraClaw Gateway` (or `UltraClaw Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "UltraClaw Gateway"
Remove-Item -Force "$env:USERPROFILE\.ultraclaw\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.ultraclaw-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://ultraclaw.os/install.sh` or `install.ps1`, the CLI was installed with `npm install -g ultraclaw@latest`.
Remove it with `npm rm -g ultraclaw` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `ultraclaw ...` / `bun run ultraclaw ...`):

1. Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2. Delete the repo directory.
3. Remove state + workspace as shown above.
