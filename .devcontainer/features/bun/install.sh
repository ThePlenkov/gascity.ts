#!/bin/bash
set -e

# Bun is installed by the homebrew feature dependency defined in
# devcontainer-feature.json. This script only ensures the current
# feature build has the homebrew binary on PATH and verifies the
# installation is available.
echo "Verifying Bun JavaScript runtime..."

# Load the homebrew environment so the current shell can find bun.
BREW_ENV="/home/linuxbrew/.linuxbrew/bin/brew"
if [[ -x "$BREW_ENV" ]]; then
    eval "$($BREW_ENV shellenv)"
fi

export PATH="/home/linuxbrew/.linuxbrew/bin:$PATH"

# Verify installation
if command -v bun &> /dev/null; then
    echo "Bun installed successfully!"
    bun --version
else
    echo "Warning: Bun binary not found on PATH" >&2
fi