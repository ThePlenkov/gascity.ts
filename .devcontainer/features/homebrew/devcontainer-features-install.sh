#!/bin/bash
set -e

# Wrapper script for dev container feature installation
# This script is called by the dev containers CLI and delegates to the actual install script

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Call the actual installation script using absolute path
bash "$SCRIPT_DIR/install.sh"

# Exit successfully to prevent the devcontainer CLI wrapper from trying to call ./install.sh
exit 0