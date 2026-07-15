#!/usr/bin/env bash
set -euo pipefail

url="${1:?usage: wait-for-url.sh <url> [timeout_seconds]}"
timeout_seconds="${2:-60}"
deadline=$((SECONDS + timeout_seconds))

until curl -fsS "$url" >/dev/null; do
  if ((SECONDS >= deadline)); then
    echo "Timed out waiting for $url" >&2
    exit 1
  fi
  sleep 2
done
