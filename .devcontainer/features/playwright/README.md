# Playwright DevContainer Feature

This feature installs system dependencies required for Playwright browser automation in devcontainer environments.

It uses Playwright's own `install-deps` command to ensure the dependency list is always up-to-date with the latest Playwright releases. This handles package name changes across Ubuntu versions (e.g., t64 suffix, libgdk-pixbuf replacements) automatically.

## Features

- Installs all required system libraries for browser automation via Playwright's install-deps
- Supports multiple browser engines (Chromium, Firefox, WebKit)
- Configures environment for headless browser operation
- Always uses the latest Playwright dependency lists

## Options

### `browsers` (default: "chromium")

Which browser engines to install system dependencies for:

- `chromium` - Install dependencies for Chromium only (default, recommended for most use cases)
- `firefox` - Install dependencies for Firefox
- `webkit` - Install dependencies for WebKit (Safari)
- `all` - Install dependencies for all browser engines

### `installMethod` (default: "auto")

How browser binaries should be managed:

- `auto` - Let Playwright manage browser binaries via `npx playwright install` (recommended)
- `system` - Install system dependencies only, manage browser binaries manually

## Usage

### Basic Usage

Add to your `devcontainer.json`:

```json
{
  "features": {
    "./features/playwright": {}
  }
}
```

### With Custom Options

```json
{
  "features": {
    "./features/playwright": {
      "browsers": "all",
      "installMethod": "auto"
    }
  }
}
```

### Complete Example

```json
{
  "name": "gascity.ts",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/node:2.1.0": {
      "version": "24"
    },
    "./features/playwright": {
      "browsers": "chromium",
      "installMethod": "auto"
    }
  },
  "postCreateCommand": "bun install && npx playwright install chromium"
}
```

## System Dependencies Installed

This feature uses Playwright's `install-deps` command, which automatically installs the correct system packages for your Ubuntu version. The exact packages vary by distribution and Playwright version, but typically include:

- X11 and graphics libraries (libx11, libxcomposite, libxdamage, etc.)
- Rendering and font libraries (libcairo, libpango, libfreetype, etc.)
- GTK and accessibility libraries (libgtk-3-0, libatk, etc.)
- Audio and media libraries (libasound2, etc.)

Playwright maintains these lists in their source code and updates them as Ubuntu package names change, so you always get the correct dependencies.

## Environment Variables

The feature sets the following environment variable:

- `DISPLAY=:99` - Configured for headless browser operation

## Manual Browser Installation

If you choose `installMethod: "system"` or need to install browsers manually:

```bash
# Install Chromium
npx playwright install chromium

# Install Firefox
npx playwright install firefox

# Install WebKit
npx playwright install webkit

# Install all browsers
npx playwright install
```

## Troubleshooting

### Browser binaries not found

If Playwright cannot find browser binaries after container creation:

```bash
# Reinstall browser binaries
npx playwright install --force
```

### Missing system dependencies

If you encounter errors related to missing libraries:

```bash
# Reinstall dependencies using Playwright's command
npx playwright install-deps chromium
```

### Display issues

If you encounter display-related errors:

```bash
# Ensure DISPLAY variable is set
export DISPLAY=:99

# Or use xvfb-run for virtual display
xvfb-run npx playwright test
```

## License

MIT

## Links

- [Playwright Documentation](https://playwright.dev)
- [DevContainer Features Specification](https://code.visualstudio.com/docs/devcontainers/containers-feature#_devcontainerjson-properties)
