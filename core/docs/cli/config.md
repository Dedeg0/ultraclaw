---
summary: "CLI reference for `ultraclaw config` (get/set/unset/file/validate)"
read_when:
  - You want to read or edit config non-interactively
title: "config"
---

# `ultraclaw config`

Config helpers: get/set/unset/validate values by path and print the active
config file. Run without a subcommand to open
the configure wizard (same as `ultraclaw configure`).

## Examples

```bash
ultraclaw config file
ultraclaw config get browser.executablePath
ultraclaw config set browser.executablePath "/usr/bin/google-chrome"
ultraclaw config set agents.defaults.heartbeat.every "2h"
ultraclaw config set agents.list[0].tools.exec.node "node-id-or-name"
ultraclaw config unset tools.web.search.apiKey
ultraclaw config validate
ultraclaw config validate --json
```

## Paths

Paths use dot or bracket notation:

```bash
ultraclaw config get agents.defaults.workspace
ultraclaw config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
ultraclaw config get agents.list
ultraclaw config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--strict-json` to require JSON5 parsing. `--json` remains supported as a legacy alias.

```bash
ultraclaw config set agents.defaults.heartbeat.every "0m"
ultraclaw config set gateway.port 19001 --strict-json
ultraclaw config set channels.whatsapp.groups '["*"]' --strict-json
```

## Subcommands

- `config file`: Print the active config file path (resolved from `ULTRACLAW_CONFIG_PATH` or default location).

Restart the gateway after edits.

## Validate

Validate the current config against the active schema without starting the
gateway.

```bash
ultraclaw config validate
ultraclaw config validate --json
```
