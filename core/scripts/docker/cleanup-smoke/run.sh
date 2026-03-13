#!/usr/bin/env bash
set -euo pipefail

cd /repo

export ULTRACLAW_STATE_DIR="/tmp/ultraclaw-test"
export ULTRACLAW_CONFIG_PATH="${ULTRACLAW_STATE_DIR}/ultraclaw.json"

echo "==> Build"
pnpm build

echo "==> Seed state"
mkdir -p "${ULTRACLAW_STATE_DIR}/credentials"
mkdir -p "${ULTRACLAW_STATE_DIR}/agents/main/sessions"
echo '{}' >"${ULTRACLAW_CONFIG_PATH}"
echo 'creds' >"${ULTRACLAW_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${ULTRACLAW_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm ultraclaw reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${ULTRACLAW_CONFIG_PATH}"
test ! -d "${ULTRACLAW_STATE_DIR}/credentials"
test ! -d "${ULTRACLAW_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${ULTRACLAW_STATE_DIR}/credentials"
echo '{}' >"${ULTRACLAW_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm ultraclaw uninstall --state --yes --non-interactive

test ! -d "${ULTRACLAW_STATE_DIR}"

echo "OK"
