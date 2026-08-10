// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import presetParams from '../constants/presetParams'
import specialParams from '../constants/specialParams'

import {
  isObject,
  paramObjectFactory,
  buildParamObject,
  buildZonedGlobalParam,
  buildGlobalParam,
  buildPitchBendParam,
  buildZonedParamObjects
} from '../utilities'

// MOVE to ./constants when complete
const nonZonedGroups = ["pedal", "slider"];
const nonZonedGlobals = presetParams['globals'].params.slice(3); // ignore preset_version bytes 0-2
const zonedGlobals = presetParams['zone_globals'].params;

// for zoned items: flatten values and split by even:odd
export default function buildSendPreset(preset) {
  let zonedGlobalsGroup = [], globalsGroup = []

  const messages = Object.keys(preset).reduce((messageArray, key) => {
    const currentItem = preset[key];
    let currentKey = (specialParams[key]) ? specialParams[key] : key
    // name
    if(currentKey === 'name') {
        messageArray.push(paramObjectFactory("name", currentItem))
    } else if (nonZonedGroups.includes(currentKey)) {
    // pedals, sliders
      messageArray.push(...buildParamObject(currentKey, currentItem));
    } else if(nonZonedGlobals.includes(currentKey)) {
    // globals
      globalsGroup.push(paramObjectFactory(currentKey, currentItem))
    } else { // zoned objects
      if(isObject(currentItem)){
        if(currentKey === 'pitch_bend'){
          messageArray.push(...buildPitchBendParam(currentItem))
        } else if(currentKey === 'addendum'){
          // addendum
          // loop through keys
        }

      } else if(isObject(currentItem[0])) {
        // Key_axis
        messageArray.push(...buildZonedParamObjects(currentKey, currentItem))
      } else {
				// zoned globals
				zonedGlobalsGroup.push(paramObjectFactory(currentKey, currentItem));
			}
    }
    return messageArray;
  }, []);

  // add zonedGlobals
  messages.push(...buildZonedGlobalParam(zonedGlobalsGroup))
  // add globals
  messages.push(buildGlobalParam(globalsGroup))

  // console.log(messages)

  return messages
}
