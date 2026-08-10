// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import { updatedDiff } from 'deep-object-diff'
import isEmpty from 'lodash.isempty'

import {
  REVERTABLE_PRESET
} from '../actions/actionTypes'

import presetActionList from '../constants/presetActionList'
import { getOriginPreset } from '../utilities'

const presetDiff = store => next => action => {
  const result = next(action),
        state = store.getState()

  // this could live in KBoardPro4Listener but we would have to ignore CRUD changes to state.presets
  if(presetActionList.includes(action.type)){
    const revertableDiff = updatedDiff(getOriginPreset(state), state.currentPreset)

    if(!isEmpty(revertableDiff)){
      // console.log('revertableDiff', revertableDiff);
      store.dispatch({type: REVERTABLE_PRESET, diffLength: Object.keys(revertableDiff).length})
    } else {
      store.dispatch({type: REVERTABLE_PRESET, diffLength: false})
    }
  }

  return result
}

export default presetDiff
