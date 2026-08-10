# Contributing to the K-Board Pro 4 Editor

Thanks for your interest in improving the K-Board Pro 4 Editor! This document covers
how to build the project, the conventions we follow, and how to submit changes.

## License of contributions

This project is licensed under the **Mozilla Public License 2.0 (MPL-2.0)**. By
submitting a contribution, you agree that your contribution is licensed under the
MPL-2.0. New source files should carry the standard header (see
[Source file headers](#source-file-headers)).

Note that the MPL-2.0 covers the **source code only**. It does not grant any rights
to KMI Music, Inc. trademarks or brand assets — see [Trademarks](#trademarks).

## Prerequisites

- **Node.js 24** (the repo pins this in `.nvmrc`)
- **npm 10+** (ships with Node 24)
- macOS or Windows for desktop builds; any modern OS for the web app

If you use [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm use        # reads .nvmrc → Node 24
```

## Getting started

```bash
git clone <your-fork-url> kbp4-editor
cd kbp4-editor
nvm use
npm install    # installs all workspaces from the root
```

## Repository layout

| Path | What it is |
|------|------------|
| `apps/web` | Browser editor (Create React App 5 + craco) |
| `apps/desktop` | Electron desktop editor |
| `packages/kbp4-js-api` | Shared Web MIDI / SysEx transport for talking to the device |

The apps are thin shells over the shared `kbp4-js-api` package. `apps/web` imports the
package's built `dist/`, which is regenerated automatically on `npm install` (via the
package's `prepare` script).

## Build & run

```bash
# Web editor
npm run start --workspace apps/web   # dev server
npm run build --workspace apps/web   # production build → apps/web/build

# Desktop editor
npm run start --workspace apps/desktop  # sync renderer + launch Electron
```

`start` in `apps/desktop` first runs `sync-renderer`, which builds `apps/web` and copies
the output into `apps/desktop/renderer/`.

## Source file headers

Authored source files (`.js`, `.jsx`, `.css`) carry a short MPL notice. Add it to any
new file:

```js
// SPDX-License-Identifier: MPL-2.0
// Copyright (c) <year> KMI Music, Inc.
```

For CSS use the block-comment form:

```css
/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (c) <year> KMI Music, Inc. */
```

## Coding conventions

- Match the style of the surrounding code.
- Keep shared device/transport behavior in `packages/kbp4-js-api` rather than
  duplicating it in an app.
- Line endings are normalized to **LF** via `.gitattributes`.

## Submitting changes

1. Fork and create a topic branch.
2. Make your change with a clear, focused commit history.
3. Ensure the affected app still builds (`npm run build --workspace apps/web` and/or a
   desktop build).
4. Open a pull request describing the change and how you verified it.

## Trademarks

"K-Board", "K-Board Pro 4", "KMI", "KMI Music", and "Muse Kinetics", along with
associated logos, are trademarks of KMI Music, Inc. The open-source license applies to
the code and does **not** grant permission to use these names, logos, or brand assets,
whether for a fork's branding, a derived product, or promotion. Please rename/rebrand
redistributed builds accordingly.
