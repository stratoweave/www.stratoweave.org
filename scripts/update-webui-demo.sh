#!/usr/bin/env sh
# Build the SORESPO webui interactive demo and stage it under static/demo/webui/.
#
# Used both locally (for `zola serve` previews) and by CI (which checks out
# sorespo and points SORESPO_DIR at it). static/demo/ is gitignored — the
# demo is built fresh on every site deploy, never committed.
#
#   SORESPO_DIR  sorespo checkout (default: ../sorespo next to this repo)
#   DEMO_OUT     build output dir inside webui/ (default: build)
set -eu

SITE_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
SORESPO_DIR="${SORESPO_DIR:-$SITE_DIR/../sorespo}"
DEMO_OUT="${DEMO_OUT:-build}"
DEST="$SITE_DIR/static/demo/webui"

if [ ! -d "$SORESPO_DIR/webui" ]; then
    echo "error: no webui/ in SORESPO_DIR ($SORESPO_DIR) — clone sorespo next to this repo or set SORESPO_DIR" >&2
    exit 1
fi

cd "$SORESPO_DIR/webui"
bun install
bun run build:demo

if [ ! -f "$DEMO_OUT/index.html" ]; then
    echo "error: $DEMO_OUT/index.html not found — set DEMO_OUT to the build:demo output dir" >&2
    exit 1
fi

rm -rf "$DEST"
mkdir -p "$(dirname "$DEST")"
cp -R "$DEMO_OUT" "$DEST"

echo "Demo staged in static/demo/webui:"
du -sh "$DEST"
find "$DEST" -type f | wc -l
