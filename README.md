# K-Board Pro 4 Editor

The editor for the [KMI](https://www.keithmcmillen.com) **K-Board Pro 4** MPE keyboard
controller — a browser and desktop app for editing presets, key/zone configuration,
MPE settings, velocity curves, and for updating the controller's firmware.

This is an npm-workspaces monorepo targeting Node 24 / Create React App 5 (via craco)
for the web app and Electron 29 for the desktop app.

## Layout

- `apps/web` — browser editor (React / Redux, CRA 5 + craco)
- `apps/desktop` — Electron desktop shell that loads the built web renderer
- `packages/kbp4-js-api` — shared device transport and SysEx layer (Web MIDI)

## Prerequisites

- **Node.js 24** (pinned in `.nvmrc` — run `nvm use` in this directory)
- **npm 10+** (ships with Node 24)

## Getting started

```sh
nvm use            # select Node 24
npm install        # install all workspaces from the root
```

### Run the web editor

```sh
npm run start --workspace apps/web
```

The editor connects to a K-Board Pro 4 over Web MIDI (Chrome/Edge). Grant the browser
MIDI + SysEx permission when prompted.

### Run the desktop app

```sh
npm run start --workspace apps/desktop
```

This builds the web renderer, syncs it into `apps/desktop/renderer/`, and launches
Electron.

## Firmware update

The desktop app updates the K-Board Pro 4 firmware in two stages — the central board
first, then the four peripheral octave boards. A progress dialog reports each stage; if
an octave does not respond, the update reports a failure and links to
[support.musekinetics.com](https://support.musekinetics.com/).

## License

Source code is licensed under the **Mozilla Public License 2.0 (MPL-2.0)** — see
[`LICENSE`](./LICENSE). The license covers the source code only and grants no rights to
KMI Music, Inc. trademarks or brand assets — see [`NOTICE`](./NOTICE). Contributions are
welcome under the terms in [`CONTRIBUTING.md`](./CONTRIBUTING.md).
