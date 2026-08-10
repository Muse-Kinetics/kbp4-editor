// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import { SYX_MESSAGE_START_LOCATION } from '../constants/sysEx'

export default function buildFirmwareVersion(sysex){
  return {
    central_bootloader: sysex.slice(0, 4).join('.'),
    central_firmware: sysex.slice(4, 8).join('.'),
    peripheral_bootloader: sysex.slice(8, 12).join('.'),
    peripheral_firmware: sysex.slice(12).join('.')
  }
}
