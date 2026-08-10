// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import initialState from './initialState'
import {
  ONLINE,
  OFFLINE,
  IS_ELECTRON,
  SET_STATUS_MESSAGE,
  SET_AVAILABLE_EDITOR,
  SET_EDITOR_UPDATE_AVAILABLE,
  TOGGLE_PRESET_DIALOG,
  SET_USER_PRESET_NAME,
  SELECT_PRESET_DESTINATION,
  SELECT_PRESET,
  SELECT_KEY,
  REVERTABLE_PRESET,
  OPEN_VELOCITY_CURVES,
  CLOSE_VELOCITY_CURVES,
  SET_CURVE_EDITOR_OPENER,
  SET_REVERTABLE_CURVE,
  OPEN_KEY_GAIN,
  CLOSE_KEY_GAIN,
  INITIAL_PRESET_LOADED,
  SELECT_VELOCITY_CURVE,
  SELECT_USER_CURVE,
  DEVICE_PRESETS_LOADED,
  OPEN_PREFERENCES,
  OPEN_PRESET_RENAMER,
  CLOSE_PRESET_RENAMER,
  SET_TEMP_IMPORTED_PRESETS,
  SET_IMPORTED_PRESET_NAME,
  SET_IMPORTED_PRESET_NAMES,
  RESET_IMPORTED_NAMES,
  SELECT_ZONE,
  SET_VISUALZER_STATE,
  EDITOR_UPDATING,
  EDITOR_DOWNLOAD_PROGRESS,
  SET_SENSOR_MODE,
  SET_SOLO_MESSAGE_TYPE,
  SET_SOLO_MESSAGE_CHANNEL,
  SET_MIDI_THRU,
  REFRESH_THRU_PORTS
} from '../actions/actionTypes'

export default function editorReducer(state = initialState.editor, action) {
  switch (action.type) {
    case SELECT_ZONE: {
      return { ...state, selectedZone: action.zone }
    }
    case ONLINE:
      return { ...state, networkConnection: true }

    case OFFLINE:
      return { ...state, networkConnection: false }

    case IS_ELECTRON:
      return { ...state, isElectron: action.state }

    case SET_STATUS_MESSAGE:
      return { ...state, statusMessage: action.message }

    case SET_AVAILABLE_EDITOR:
      return { ...state, availableEditor: action.version }

    case SET_EDITOR_UPDATE_AVAILABLE:
      return { ...state, editorUpdateAvailable: action.updateable > 0 }

    case SELECT_PRESET_DESTINATION:
      return { ...state, destination: action.destination }

    case TOGGLE_PRESET_DIALOG:
      return { ...state, userPresetDialogOpen: !state.userPresetDialogOpen }

    case SET_USER_PRESET_NAME:
      return { ...state, userPresetName: action.name }

    case SELECT_PRESET:
      return { ...state, selectedPreset: action.selectedPreset }

    case REVERTABLE_PRESET:
      return { ...state, revertablePreset: action.diffLength }

    case SELECT_KEY:
      return { ...state, selectedKey: action.key }

    case OPEN_VELOCITY_CURVES:
      return { ...state, velocityCurvesOpen: true }

    case CLOSE_VELOCITY_CURVES:
      return { ...state, velocityCurvesOpen: false }

    case SET_CURVE_EDITOR_OPENER:
      return { ...state, curveEditorOpener: action.index }

    case OPEN_KEY_GAIN:
      return { ...state, keyGainModeOpen: true }

    case CLOSE_KEY_GAIN:
      return { ...state, keyGainModeOpen: false }

    case SELECT_VELOCITY_CURVE:
      return { ...state, selectedVelocityCurve: action.index }

    case SET_REVERTABLE_CURVE:
      return { ...state, revertableCurve: action.revertable }

    case SELECT_USER_CURVE:
      return { ...state, selectedUserCurve: action.index }

    case INITIAL_PRESET_LOADED:
      return { ...state, initialPresetLoaded: true }

    case DEVICE_PRESETS_LOADED:
      return { ...state, devicePresetsLoaded: action.status }

    case OPEN_PREFERENCES:
      return { ...state, preferencesOpen: action.open }

    case OPEN_PRESET_RENAMER:
      return { ...state, presetsImportRenameDialogOpen: true }

    case CLOSE_PRESET_RENAMER:
      return { ...state, presetsImportRenameDialogOpen: false }

    case SET_TEMP_IMPORTED_PRESETS:
      return {
        ...state,
        importedPresets: {
          ...state.importedPresets,
          presets: [ ...action.presets ],
          duplicates: { ...action.duplicates }
        }
      }

    case SET_IMPORTED_PRESET_NAME:
      return {
        ...state,
        importedPresets: {
          ...state.importedPresets,
          renamed: {
            ...state.importedPresets.renamed,
            [action.index] : action.name
          }
        }
      }

    case SET_IMPORTED_PRESET_NAMES:
      return {
         ...state,
         importedPresets: {
           ...state.importedPresets,
           renamed: action.names
         }
       }

    case RESET_IMPORTED_NAMES:
      return {
        ...state,
         importedPresets: {
           presets: [],
           duplicates: {},
           renamed: {}
         }
      }

    case SET_VISUALZER_STATE:
      return { ...state, visualzerActive: action.active }

    case EDITOR_UPDATING:
      return { ...state, updatingEditor: action.updating }

    case EDITOR_DOWNLOAD_PROGRESS:
      return { ...state, downloadProgress: action.percent }

    case SET_SENSOR_MODE:
      return { ...state, sensorEditMode: action.mode }

    case SET_SOLO_MESSAGE_TYPE:
      return { ...state, soloMessageType: action.messageType }

    case SET_SOLO_MESSAGE_CHANNEL:
      return { ...state, soloMessageChannel: action.channel }

    case SET_MIDI_THRU:
      return { ...state, midithruport: action.portname }

    case REFRESH_THRU_PORTS:
      return { ...state, midithruport: "none" }

    default:
      return state
  }
}
