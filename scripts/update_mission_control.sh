#!/bin/bash
set -euo pipefail

MC_DIR="/root/mission-control"
LOG_DIR="/root/.openclaw/workspace/deploy_artifacts"
TS="$(date -u +"%Y%m%dT%H%M%SZ")"
LOG_FILE="$LOG_DIR/mission-control-update-$TS.log"

mkdir -p "$LOG_DIR"

{
  echo "[$TS] Mission Control update start"
  echo "dir=$MC_DIR"

  if [ ! -d "$MC_DIR/.git" ]; then
    echo "ERROR: $MC_DIR is not a git repo"
    exit 2
  fi

  cd "$MC_DIR"

  echo "-- git status (before) --"
  git status -sb || true

  echo "-- git fetch/pull --"
  git fetch --all --prune
  # Prefer fast-forward only (avoid unintended merges)
  git pull --ff-only || {
    echo "WARN: git pull --ff-only failed; leaving repo as-is"
  }

  echo "-- npm install/build --"
  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install
  fi
  npm run build

  echo "-- pm2 restart --"
  if command -v pm2 >/dev/null 2>&1; then
    pm2 restart mission-control || pm2 start "npm" --name mission-control -- run start -- -p 4000
    pm2 save || true
  else
    echo "ERROR: pm2 not found"
    exit 3
  fi

  echo "-- nginx reload (best-effort) --"
  if command -v nginx >/dev/null 2>&1; then
    nginx -t && systemctl reload nginx || true
  elif [ -x /usr/sbin/nginx ]; then
    /usr/sbin/nginx -t && systemctl reload nginx || true
  else
    echo "WARN: nginx binary not found; skipping reload"
  fi

  echo "-- healthcheck --"
  curl -fsS -o /dev/null -w "HTTP %{http_code}\n" https://odanielsoares.tech || true

  echo "[$TS] Mission Control update done"
} |& tee "$LOG_FILE"
