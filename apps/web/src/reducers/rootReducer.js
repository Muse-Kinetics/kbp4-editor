// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import { combineReducers } from 'redux'

import deviceReducer from './deviceReducer'
import editorReducer from './editorReducer'
import currentPresetReducer from './currentPresetReducer'
import presetsReducer from './presetsReducer'
import userCurveReducer from './userCurveReducer'
import keySensorsReducer from './keySensorsReducer'
import preferencesReducer from './preferencesReducer'

const KBoardPro4App = combineReducers({
  device: deviceReducer,
  editor: editorReducer,
  currentPreset: currentPresetReducer,
  presets: presetsReducer,
  userCurves: userCurveReducer,
  keySensors: keySensorsReducer,
  editorPreferences: preferencesReducer
})

export default KBoardPro4App
/*
  // using combineReducers multiple times for nested reducers

  https://github.com/reactjs/redux/issues/738

  rootReducer = combineReducers({
    device: deviceReducer,
    editor: combineReducers({
      profile: combineReducers({
         info, // reducer function
         credentials // reducer function
      }),
      billing // reducer function
    }),
    // ... other combineReducers
  })
});
*/
