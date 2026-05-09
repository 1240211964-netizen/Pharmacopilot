# Change Records

This directory records every Codex modification round in this project.

## Required Workflow

Before changing files in a round:

1. Create a timestamped backup directory under `change-records/backups/`.
2. Copy every file that will be edited into that backup directory, preserving relative paths.
3. Create one timestamped markdown record in `change-records/`.

After changing files:

1. Update the markdown record with changed files, main edits, and verification commands.
2. Keep the backup directory unchanged as the pre-change version for that round.
3. If generated output is refreshed, note the source files and generated targets separately.

## Naming

- Log file: `YYYY-MM-DD-HHMM-short-title.md`
- Backup directory: `change-records/backups/YYYY-MM-DD-HHMM-short-title/`

## Current Baseline

The snapshot at `change-records/backups/2026-05-08-1749-current-baseline/` captures the current core frontend files before future modification rounds.
