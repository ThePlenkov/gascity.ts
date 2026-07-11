#!/bin/bash
set -e

echo "Installing Bun JavaScript runtime..."

# Install Bun using the official installer
curl -fsSL https://bun.sh/install | bash

# Add bun to PATH for current and future sessions
BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Add to .bashrc if it exists
if [ -f "$HOME/.bashrc" ]; then
    if ! grep -q 'export BUN_INSTALL="$HOME/.bun"' "$HOME/.bashrc"; then
        echo 'export BUN_INSTALL="$HOME/.bun"' >> "$HOME/.bashrc"
        echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> "$HOME/.bashrc"
    fi
fi

# Add to .zshrc if it exists
if [ -f "$HOME/.zshrc" ]; then
    if ! grep -q 'export BUN_INSTALL="$HOME/.bun"' "$HOME/.zshrc"; then
        echo 'export BUN_INSTALL="$HOME/.bun"' >> "$HOME/.zshrc"
        echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> "$HOME/.zshrc"
    fi
fi

# Verify installation
if command -v bun &> /dev/null; then
    echo "Bun installed successfully!"
    bun --version
else
    echo "Warning: Bun binary not found on PATH"
fi