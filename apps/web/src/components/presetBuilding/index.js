// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import PresetBuilder from './PresetBuilder'

let preset = {}

export function newPreset(param){
  preset = new PresetBuilder()
  // sets preset index
  console.log(`>> K-Board Pro 4 Editor: building preset ${param.values}`);
}

export function addToPreset(param){
  preset.add(param)
}

export function getPreset(){
  const builtPreset = preset.get()

  // reset preset
  preset = null

  return builtPreset
}
