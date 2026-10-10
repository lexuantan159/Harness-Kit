#!/usr/bin/env sh
# Install / update the harness into a project. See README.md.
# Usage: ./install.sh [install|update|uninstall|status] <target-dir> [options]
set -e
command -v node >/dev/null 2>&1 || { echo "Node.js >= 18 is required (hooks and installer run on Node)." >&2; exit 1; }
KIT_DIR="$(cd "$(dirname "$0")" && pwd)"
case "$1" in
  install|update|uninstall|status) exec node "$KIT_DIR/bin/harness.js" "$@" ;;
  *) exec node "$KIT_DIR/bin/harness.js" install "$@" ;;
esac
