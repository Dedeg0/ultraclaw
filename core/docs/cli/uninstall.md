---
summary: "CLI reference for `ultraclaw uninstall` (remove gateway service + local data)"
read_when:
  - You want to remove the gateway service and/or local state
  - You want a dry-run first
title: "uninstall"
---

# `ultraclaw uninstall`

Uninstall the gateway service + local data (CLI remains).

```bash
ultraclaw backup create
ultraclaw uninstall
ultraclaw uninstall --all --yes
ultraclaw uninstall --dry-run
```

Run `ultraclaw backup create` first if you want a restorable snapshot before removing state or workspaces.
