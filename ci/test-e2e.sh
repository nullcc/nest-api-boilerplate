#!/usr/bin/env bash
set -euo pipefail

if [[ -n "${INTEGRESQL_URL:-}" ]]; then
  bash ci/wait-for-url.sh "${INTEGRESQL_URL}/api/v1/templates" 90
fi

npm run test:e2e -- --runInBand
