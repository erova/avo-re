#!/bin/bash
# ─────────────────────────────────────────────────────────────
# make-zip.sh
# 
# Creates a portable zip of the wireframe-kit folder.
# Excludes node_modules, .next, and cache files.
# Output: wireframe-kit.zip at repo root.
#
# Usage: ./wireframe-kit/scripts/make-zip.sh
# ─────────────────────────────────────────────────────────────

set -e

# Navigate to repo root (parent of wireframe-kit)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
WIREFRAME_DIR="$REPO_ROOT/wireframe-kit"
OUTPUT_ZIP="$REPO_ROOT/wireframe-kit.zip"

# Remove existing zip if present
if [ -f "$OUTPUT_ZIP" ]; then
  rm "$OUTPUT_ZIP"
  echo "Removed existing wireframe-kit.zip"
fi

# Create zip with only the needed files
cd "$REPO_ROOT"
zip -r "$OUTPUT_ZIP" wireframe-kit \
  -x "wireframe-kit/node_modules/*" \
  -x "wireframe-kit/.next/*" \
  -x "wireframe-kit/.cache/*" \
  -x "wireframe-kit/.turbo/*" \
  -x "wireframe-kit/*.log" \
  -x "wireframe-kit/.DS_Store" \
  -x "wireframe-kit/**/.DS_Store"

echo ""
echo "✓ Created: $OUTPUT_ZIP"
echo ""
echo "Contents:"
unzip -l "$OUTPUT_ZIP" | head -20
echo "..."
