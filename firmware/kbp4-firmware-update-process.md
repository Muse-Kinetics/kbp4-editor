# KBP4 Firmware Update Process (via `sendsysex`)

This is the reference for updating K-Board Pro 4 firmware over SysEx using the `sendsysex` submodule (`sendsysex/` at repo root, released as `SendSysEx.exe`). It covers the validated command shape, exactly what each transfer parameter does, and why the process has to happen in this specific order with these specific timings. Confirmed on real hardware, both `--midi-backend winmm` and `--midi-backend wms`, as of `sendsysex` v0.12.0.

For the full bug-by-bug investigation history (what was broken and how each fix was found), see `commands.md`'s "Field update via SysEx" section and `sendsysex/data/families/kbp4.json`'s payload notes — this doc is the distilled "how and why," not the blow-by-blow.

## Recommended: automatic update

```
SendSysEx --fw-update KBP4 --midi-backend winmm
SendSysEx --fw-update KBP4 --midi-backend wms
```

This does everything below automatically — port discovery, correct ordering, correct transfer parameters — for both Windows MIDI backends. No `-p`/`-n`/`-cs`/`-cd`/etc. flags needed unless you want to override something.

## What it does, in order

1. **Sends Peripheral firmware first**, while Central is still in **application** mode. Central relays it to all 4 peripherals over I2C (message `0x2110`/`FIRMWARE_PERIPH_MESSAGE`).
2. **Triggers Central's bootloader-entry**, waits for the device to reboot into Central's bootloader.
3. **Flashes Central firmware** once in **bootloader** mode.
4. **Waits for reboot** back to application mode, then confirms it.

If invoked while the device happens to already be sitting in Central's bootloader (e.g. resuming an interrupted prior run), step 1 is sent as a catch-up step after Central's flash completes and the device reboots back to application — since it's physically impossible to relay to the peripherals while Central itself is in bootloader mode. See "Why Peripheral has to go before Central" below.

## Transfer parameters

| Flag | Value | What it controls |
|---|---|---|
| `-fcs` / `--first-chunk-size` | `32` (bytes) | Size of the very first sub-split window of the transfer only. |
| `-cs` / `--chunk-size` | `512` (default) | Size of every window after the first one. |
| `-fgd` / `--first-gap-delay` | `3000` (ms) | Delay after the first window only, before sending the second. |
| `-cd` / `--chunk-delay` | `150` (ms) | Delay between every window after the first one. |
| `-pd` / `--post-delay` | `3000` (ms) | Delay after the last window, before the port closes. |

`--fw-update KBP4` applies all five of these automatically, on both backends. For manual/raw-send troubleshooting (e.g. testing one specific `.syx` file), pass them explicitly:

```
SendSysEx -n "K-Board Pro 4 Bootloader" -f v1.2.2.0_kbp4_central.syx    -fcs 32 -fgd 3000 -cs 512 -cd 150 -pd 3000 --midi-backend winmm
SendSysEx -n "K-Board Pro 4"            -f v1.2.2.0_kbp4_peripheral.syx -fcs 32 -fgd 3000 -cs 512 -cd 150 -pd 3000 --midi-backend winmm
```

Re-check the exact port name/number with `-l` first — raw send does exact matching only, and both names and numbers shift on replug.

## Why the transfer needs this exact shape

Both of Central's firmware-receiving code paths — the bootloader's page-flash handler, and the application's I2C relay handler — start a **blocking operation** (consistent with a flash/I2C erase) as soon as they recognize the message header, which arrives in the first ~24 bytes. While that blocking operation runs, Central can't service the USB endpoint again for roughly 2–3 seconds.

That collides badly with how a SysEx transfer is normally sub-split into multiple windows: each window is sent as its own `midiOutLongMsg` call, and WinMM has zero tolerance for a stall mid-call — it just errors out. Three separate constraints fall out of this:

1. **The first window must be small (32 bytes).** It has to fully clear the host and finish transmitting over USB *before* the device starts blocking. A window that's still bigger — 64 bytes, 512 bytes — is still mid-transmission when the blocking operation kicks in, so that in-flight `midiOutLongMsg` call itself fails. This isn't about total transfer size; it's about how much data can get out the door before the device stops listening.
2. **The gap after that first window must be long (`-fgd 3000`).** The device needs the full 2–3 seconds to finish its blocking operation before it's ready to receive the second window. A normal chunk delay (100–150ms) isn't remotely enough — the second `midiOutLongMsg` call fails outright if sent too soon.
3. **Every window after that can be fast and normal-sized (`-cs 512`, `-cd 150`).** Once the device is past its one blocking operation, it drains the rest of the transfer without further stalls, so there's no reason to keep the small-window/long-gap pattern going for the whole file — that would make the transfer take 60+ minutes for no benefit.

`-pd 3000` is a separate, smaller safety margin: it gives the device time to finish writing/verifying the final page and (for Central) reboot cleanly before the host closes the port, so a slow last write doesn't get cut off.

Plain WMS backend, without `--midi-backend winmm` forced, has not been observed needing this workaround in testing — but `--fw-update KBP4` applies it on both backends anyway rather than special-casing, since it's harmless when the device is already fast enough and there was no reason to maintain two different code paths for something backend-detection can't cleanly distinguish at the transport layer.

## Why Peripheral has to go before Central

This is a hard ordering constraint, not a preference:

- **Peripheral firmware can only be sent while Central is running its application firmware.** The transfer path is Central's app-mode SysEx handler relaying bytes to the peripherals over I2C — there's no other way to reach them (the peripheral's own bootloader has no SysEx/MIDI parser at all, only I2C).
- **Central firmware can only be sent while Central is in its bootloader.** Getting there requires triggering bootloader-entry, which reboots Central out of application mode.
- Once Central has rebooted into its bootloader, the I2C relay path Peripheral needs no longer exists until Central's application firmware is running again — so if you flash Central first, you'd have to wait for it to reboot back to application before Peripheral becomes reachable at all. Sending Peripheral first avoids that round-trip.

Separately (not an ordering constraint, but a related hazard): **never repackage either payload into multiple independently-framed SysEx messages.** The Central bootloader's `erase_app()` fires unconditionally on every validated message header with no once-per-transfer guard — a second top-level `F0...F7` message re-erases the entire app region and destroys whatever the first message just wrote. The chunking described above is safe specifically because it's transport-level sub-splitting of one single message's bytes (no new `F0`/`F7` framing inserted), never a second message. See `Firmware/_sysex_maker/BOOTLOADER_SYSEX_CAPABILITIES.md` for the full investigation.

It's safe to re-run the whole process, or just the Peripheral step, repeatedly if a transfer is interrupted — Central re-erases the peripheral's flash on every attempt regardless of what was there before.

## Verifying an update actually landed

```
SendSysEx --id-request KBP4 --midi-backend <winmm|wms>
```

reports `Bootloader version:` and `Application version:` for Central. Application-mode identity requests only started working correctly as of `sendsysex` v0.12.0 (Central's app firmware replies to identity inquiries with a proprietary message rather than a standard Identity Reply, which earlier `sendsysex` versions didn't parse). Note this only confirms Central's version, not Peripheral's — the peripherals have no MIDI identity of their own, so a self-reported Application version match after a `--fw-update KBP4` run is currently the best available signal that the flash write succeeded (the application only stamps its version into its shared boot-status page after successfully booting far enough to run its own startup check, so a correct readback is real evidence of a good flash and a working boot, not just a SysEx transfer that reported no error).
