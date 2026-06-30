#!/bin/bash
set -e

echo "Setting up Bun environment..."

# Bun is globally available via the Homebrew feature's symlink in /usr/local/bin
# No manual PATH configuration needed - Homebrew handles this automatically

# Verify installation
if command -v bun &> /dev/null; then
    echo "Bun installed successfully!"
    bun --version
else
    echo "Warning: Bun binary not found on PATH"
    exit 1
fi