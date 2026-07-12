// Ambient declarations for native modules that are dynamically imported in
// runtime code paths. `@homebridge/node-pty-prebuilt-multiarch`, `ws`, and
// `@types/ws` ARE installed as dependencies (see package.json), so their real
// package typings are used directly — we do NOT re-declare them here. A module
// block that only re-imports its own specifier (`import('ws')` inside
// `declare module 'ws'`) is self-referential: it forwards no typings and can
// trigger circular-declaration errors.
//
// The only compatibility alias we keep is `node-pty`: some transitive
// dependencies still import that bare specifier, so we forward it to the
// installed Homebridge package's real types.
//
// IMPORTANT: keep this file a *script* (no top-level imports/exports) so the
// `declare module` blocks remain global ambient declarations and the wildcard
// `declare module '*.css'` keeps matching CSS side-effect imports.

declare module 'node-pty' {
  export type IPty = import('@homebridge/node-pty-prebuilt-multiarch').IPty
  export const spawn: typeof import('@homebridge/node-pty-prebuilt-multiarch').spawn
  // Some dependencies still import `node-pty` directly. Re-export under
  // that name so bare-specifier imports keep working.
  export default import('@homebridge/node-pty-prebuilt-multiarch')
}

declare module '*.css'
