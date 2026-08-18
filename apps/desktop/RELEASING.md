# Releasing the K-Board Pro 4 Editor (desktop)

Build → test locally → publish the *tested* artifacts to GitHub Releases. Nothing
is published at build time; you upload exactly the files you verified.

Prereqs: Node 24 (`nvm use`), Dropbox paused for clean installs, and a root `.env`
(gitignored) sourced first: `set -a; source .env; set +a`.

## macOS

```
# from apps/desktop
npm run package-mac        # build → sign app → package DMG → sign DMG → regen channel metadata (NO notarize)
npm run package-mac-dist   # same, plus notarize + staple (needs APPLE_KEYCHAIN_PROFILE)
npm run notarize-dmg       # notarize + staple an already-built DMG
```

- Signing identity: `APPLE_SIGNING_IDENTITY` (default `Developer ID Application: Kesumo, LLC (J372N6RANB)`).
- Notarization: `APPLE_KEYCHAIN_PROFILE` must name a stored `xcrun notarytool` keychain profile.
- `release-mac.js` **regenerates `latest-mac.yml` + `.blockmap` from the final signed/stapled DMG** — electron-builder writes them against the pre-signing DMG, so without this electron-updater rejects the download with a sha512 mismatch.
- Output: `release/K-Board Pro 4 Editor-<version>-universal.dmg` (+ `.blockmap`, `latest-mac.yml`).

## Windows (run on the Windows machine)

```
npm run package-win        # build → sign → NSIS installer
```

- Signing: `win.certificateSha1` in `build` (package.json) names the KMI Music, Inc. code-signing
  cert by thumbprint. electron-builder finds it in the Windows cert store and signs the app exe and
  the NSIS installer itself via its built-in signtool integration — no custom hook needed.
  `signWindows.js` (a standalone custom sign-hook script) is not wired into the build; it predates
  this and isn't currently used.
- Requires the cert's private key to actually be accessible at build time (not just present in the
  store) — signing was disabled for a while specifically because it wasn't, on a remote session with
  no way to unlock/insert whatever the key is backed by. Verify a build's signature with:
  `signtool verify /pa /all /v "<installer>.exe"` (or PowerShell's `Get-AuthenticodeSignature`).
- Unsigned builds stay available as a standing, defined command — don't edit config to get one:

  ```
  npm run package-win-unsigned
  ```

  Useful whenever the cert's private key isn't reachable (remote session, key locked/not inserted,
  etc.) — same build, `CSC_IDENTITY_AUTO_DISCOVERY=false` set so electron-builder never probes the
  cert store.

## Test, then publish

1. Install/run the `.dmg` / `.exe` and confirm it works.
2. Publish the tested artifacts to GitHub Releases (`Muse-Kinetics/kbp4-editor`):

```
npm run publish-github-mac   # or publish-github-win
```

- Requires the `gh` CLI authenticated with write access. Creates the `v<version>` release if absent (`--generate-notes`), then uploads/replaces the DMG/EXE + blockmap + channel `.yml` (`--clobber`).
- The app's "Check For Updates" flow (`electron-updater`) reads these from the GitHub Releases feed.

## Notes

- Keep `electron-builder` on `^23.0.3` (24.x's 7zip-bin has a `chmod 7za` bug that breaks the mac build).
- Branding: appId `com.kmimusic.KBoardPro4Editor`, productName "K-Board Pro 4 Editor"; copyright KMI Music, Inc.
