#!/bin/bash
set -e

# Playwright System Dependencies Installation Script
#
# Uses Playwright's own install-deps command to install system dependencies.
# This ensures we always use the up-to-date package list from Playwright,
# which handles package name changes (e.g., t64 suffix, libgdk-pixbuf replacements).

BROWSERS=${BROWSERS:-"chromium"}
INSTALL_METHOD=${INSTALLMETHOD:-"auto"}

echo "Installing Playwright system dependencies (browsers: ${BROWSERS}, method: ${INSTALL_METHOD})..."

# Use Playwright's install-deps to install system dependencies
# This handles all the complexity of package name variations across Ubuntu versions
if command -v npx >/dev/null 2>&1; then
    npx playwright install-deps ${BROWSERS}
else
    echo "ERROR: npx not found. Node.js must be installed before this feature runs."
    echo "Ensure 'ghcr.io/devcontainers/features/node' is listed in 'installsAfter' in devcontainer-feature.json"
    exit 1
fi

# Headless display for non-X servers.
export DISPLAY=:99
for shell_config in "$HOME/.bashrc" "$HOME/.zshrc"; do
    if [[ -f "$shell_config" ]] && ! grep -q 'export DISPLAY=:99' "$shell_config"; then
        echo 'export DISPLAY=:99' >> "$shell_config"
    fi
done

echo "Playwright system dependencies installed for: ${BROWSERS}"