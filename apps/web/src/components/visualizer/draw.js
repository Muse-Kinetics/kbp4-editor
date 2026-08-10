// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
export default function(channelData) {
  channelData.key.update(channelData.axis.x, channelData.axis.y, channelData.axis.z, channelData.zone)
  channelData.key.draw()
}
