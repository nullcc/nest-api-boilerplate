#!/usr/bin/env bash
set -euo pipefail

npm run lint:check
npm run build
npm run test:unit -- --runInBand
