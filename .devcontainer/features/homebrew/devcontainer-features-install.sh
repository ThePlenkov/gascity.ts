#!/bin/bash
set -e

# Wrapper script for dev container feature installation
# This script is called by the dev containers CLI and delegates to the actual install script

# Call the actual installation script
./install.sh