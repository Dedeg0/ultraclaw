---
summary: "CLI reference for `ultraclaw logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
title: "logs"
---

# `ultraclaw logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

- Logging overview: [Logging](/logging)

## Examples

```bash
ultraclaw logs
ultraclaw logs --follow
ultraclaw logs --json
ultraclaw logs --limit 500
ultraclaw logs --local-time
ultraclaw logs --follow --local-time
```

Use `--local-time` to render timestamps in your local timezone.
