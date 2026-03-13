import { describe, expect, it } from "vitest";
import { formatBackupCreateSummary, type BackupCreateResult } from "./backup-create.js";

function makeResult(overrides: Partial<BackupCreateResult> = {}): BackupCreateResult {
  return {
    createdAt: "2026-01-01T00:00:00.000Z",
    archiveRoot: "ultraclaw-backup-2026-01-01",
    archivePath: "/tmp/ultraclaw-backup.tar.gz",
    dryRun: false,
    includeWorkspace: true,
    onlyConfig: false,
    verified: false,
    assets: [],
    skipped: [],
    ...overrides,
  };
}

describe("formatBackupCreateSummary", () => {
  it("formats created archives with included and skipped paths", () => {
    const lines = formatBackupCreateSummary(
      makeResult({
        verified: true,
        assets: [
          {
            kind: "state",
            sourcePath: "/state",
            archivePath: "archive/state",
            displayPath: "~/.ultraclaw",
          },
        ],
        skipped: [
          {
            kind: "workspace",
            sourcePath: "/workspace",
            displayPath: "~/Projects/ultraclaw",
            reason: "covered",
            coveredBy: "~/.ultraclaw",
          },
        ],
      }),
    );

    expect(lines).toEqual([
      "Backup archive: /tmp/ultraclaw-backup.tar.gz",
      "Included 1 path:",
      "- state: ~/.ultraclaw",
      "Skipped 1 path:",
      "- workspace: ~/Projects/ultraclaw (covered by ~/.ultraclaw)",
      "Created /tmp/ultraclaw-backup.tar.gz",
      "Archive verification: passed",
    ]);
  });

  it("formats dry runs and pluralized counts", () => {
    const lines = formatBackupCreateSummary(
      makeResult({
        dryRun: true,
        assets: [
          {
            kind: "config",
            sourcePath: "/config",
            archivePath: "archive/config",
            displayPath: "~/.ultraclaw/config.json",
          },
          {
            kind: "oauth",
            sourcePath: "/oauth",
            archivePath: "archive/oauth",
            displayPath: "~/.ultraclaw/oauth",
          },
        ],
      }),
    );

    expect(lines).toEqual([
      "Backup archive: /tmp/ultraclaw-backup.tar.gz",
      "Included 2 paths:",
      "- config: ~/.ultraclaw/config.json",
      "- oauth: ~/.ultraclaw/oauth",
      "Dry run only; archive was not written.",
    ]);
  });
});
