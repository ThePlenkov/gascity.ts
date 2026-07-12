/**
 * HTTP probe for the /api/pty tmux WebSocket bridge.
 *
 * The actual WebSocket upgrade is handled by the `tmuxWebSocketPlugin` in
 * `vite/pty-websocket.ts`, which attaches a `ws.WebSocketServer` to the
 * dev HTTP server. This file exists so:
 *
 *   1. The client can `fetch('/api/pty')` to feature-detect tmux + node-pty
 *      without opening a WebSocket, and show an "unavailable" hint cleanly
 *      when the host dev container doesn't have tmux on PATH or node-pty
 *      isn't installed.
 *   2. There is exactly one canonical path ("/api/pty") for both the probe
 *      and the upgrade — Vite's middleware is registered *after* this route,
 *      so the upgrade handler always wins for `Upgrade: websocket` requests.
 *
 * SECURITY: This endpoint is local-dev only. It is disabled in production
 * and never spawns processes itself — it only reports on the dynamic-import
 * probe performed by the Vite plugin's middleware.
 */
import { createFileRoute } from "@tanstack/react-router";
import { isTmuxAvailable, loadPty } from "../../server/tmux-pty";

const NAME_RE = /^[a-zA-Z0-9_.-]{1,64}$/;
const TMUX_BIN_RE = /^[a-zA-Z0-9_./-]+$/;

export const Route = createFileRoute("/api/pty")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (process.env.NODE_ENV === "production") {
          return Response.json(
            { error: "PTY endpoint is disabled in production" },
            { status: 403 },
          );
        }

        const url = new URL(request.url);
        const name = url.searchParams.get("name");
        if (name && !NAME_RE.test(name)) {
          return Response.json(
            { error: "invalid session name (allowed: a-zA-Z0-9_.-, max 64 chars)" },
            { status: 400 },
          );
        }
        const tmuxBin = process.env.TMUX_BIN ?? "tmux";
        if (!TMUX_BIN_RE.test(tmuxBin)) {
          return Response.json(
            { error: "invalid TMUX_BIN env (allowed: a-zA-Z0-9_./-)" },
            { status: 400 },
          );
        }

        // Best-effort feature detection. The Vite plugin does the same
        // check on `/api/pty/probe`; we duplicate a tiny version here so
        // a single GET is enough for the client to decide whether to
        // attempt the upgrade.
        const probe: {
          ok: boolean;
          tmuxBin: string;
          tmux: boolean;
          nodePty: boolean;
          message: string;
        } = {
          ok: false,
          tmuxBin,
          tmux: false,
          nodePty: false,
          message: "checking…",
        };
        try {
          // Use the same loader the bridge uses (`loadPty`) so the probe can't
          // report a false negative for a valid default-export module shape or
          // the `node-pty` fallback that the narrow `mod.spawn` check missed.
          await loadPty();
          probe.nodePty = true;
        } catch {
          probe.nodePty = false;
        }
        // Verify tmux is actually executable; otherwise the WebSocket opens and
        // then fails asynchronously, hiding the "unavailable" hint.
        probe.tmux = isTmuxAvailable(tmuxBin);
        probe.ok = probe.nodePty && probe.tmux;
        probe.message = probe.ok
          ? "ready — open a WebSocket to attach a session"
          : !probe.nodePty
            ? "node-pty not installed. Run `bun add @homebridge/node-pty-prebuilt-multiarch` and restart the dev server."
            : `tmux binary not found or not executable (${tmuxBin}). Install tmux and restart the dev server.`;

        return Response.json(probe, { status: probe.ok ? 200 : 503 });
      },
    },
  },
});

