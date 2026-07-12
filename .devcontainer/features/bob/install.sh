#!/bin/bash
set -e

VERSION="${VERSION:-"latest"}"

echo "Installing Bob Shell ${VERSION}..."

# Install Bob Shell globally via npm
if [[ "${VERSION}" = "latest" ]]; then
    npm install -g @roo-code/bob-shell
else
    npm install -g @roo-code/bob-shell@${VERSION}
fi

# Verify installation
if command -v bob &> /dev/null; then
    echo "Bob Shell installed successfully!"
    bob --version
else
    echo "Warning: Bob Shell installation completed but 'bob' command not found in PATH" >&2
fi
