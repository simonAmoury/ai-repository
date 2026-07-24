#!/usr/bin/env bash
# Claude 兼容入口。统一实现位于 scripts/ai-config.js。

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

case "${1:-}" in
  skills)
    node "$SCRIPT_DIR/ai-config.js" claude skills
    ;;
  -h|--help|help)
    node "$SCRIPT_DIR/ai-config.js" --help
    ;;
  *)
    node "$SCRIPT_DIR/ai-config.js" claude install "${1:-$PWD}"
    ;;
esac
