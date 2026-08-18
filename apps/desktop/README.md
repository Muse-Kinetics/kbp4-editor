# K-Board Pro 4 Editor Desktop

# Setup build environment
- npm install -g cross-env
- nvm use 14
- npm install

# Build commands
- npm run build
- npm start

# Debugging (dev only)

- `npm run start:debug` launches the app with `--remote-debugging-port=9222` open, so the
  renderer's console and JS runtime can be driven from outside the app window.
- `npm run cdp -- targets` lists available CDP targets.
- `npm run cdp -- eval "<js expr>"` evaluates JS in the renderer and prints the result.
- `npm run cdp -- watch <seconds>` streams live console output for N seconds.
- See the header comment in `tools/cdp.js` for the full command list. The renderer exposes
  `window.store` (Redux store) and `window.KBoardPro4` (device API instance) globally, so
  `cdp eval` can both inspect and drive the editor without clicking through the UI.
- Not included in any packaged build (`tools/` isn't in the `build.files` list).

# deploy

- mac
  - npm run package-mac-dist
  - need appleId and appeIdPassword environment variables in file named “.env”
- windows
  - ’npm run package-win’ builds app and creates the exe installer
