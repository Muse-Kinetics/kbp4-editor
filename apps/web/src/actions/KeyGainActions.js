// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import {
  OPEN_KEY_GAIN,
  CLOSE_KEY_GAIN,
  SENSORS_LOADED,
  SET_KEY_SENSOR_GAIN,
  REVERT_KEY_GAIN,
  SAVE_KEY_GAIN,
  SET_KEY_SENSOR,
  SET_OVERRIDE_SENSOR,
  REMOVE_OVERRIDE_SENSOR,
  REVERT_SENSOR_STATE
} from './actionTypes'

import { buildSensorObject } from '../utilities'

export const openKeyGainMode = () => ({ type: OPEN_KEY_GAIN })

export const closeKeyGainMode = () => ({ type: CLOSE_KEY_GAIN })

export const setKeySensorGain = (octave, key, sensor, gain) => ({ type: SET_KEY_SENSOR_GAIN, octave: octave, key: key, sensor: sensor, gain: gain })

export const revertKeyGain = () => ({ type: REVERT_KEY_GAIN })

export const saveKeyGain = () => ({ type: SAVE_KEY_GAIN })

export const sensorsLoaded = () => ({ type: SENSORS_LOADED, loaded: true })

export const setKeySensor = (sensorData) => {
  return (dispatch) => {
    dispatch({ type: SET_KEY_SENSOR, ...buildSensorObject(sensorData) })
  }
}

// special case for key on-threshold
export const setOverrideSensor = (gangBank, sensorData, editMode) => {
  const octaveIndexes = [0,1,2,3], keyIndexes = [0,1,2,3,4,5,6,7,8,9,10,11], sideIndexes = [0,1], sensorIndexes = [0,1,2,3,4,5]
  const [gangType, bankIndex] = gangBank.split('|').map(Number), [octave,key,side,,sensorValue] = sensorData.split(',').map(Number)

  let overrideSensors = []

  switch (Number(editMode)) {
    case 0: // single sensor
        overrideSensors.push([gangType,bankIndex,sensorData].join(','))
      break;
    case 1: // entire key
      sideIndexes.forEach(sideIndex => {
        sensorIndexes.forEach(sensorIndex => {
          overrideSensors.push([gangType,bankIndex,octave,key,sideIndex,sensorIndex,sensorValue].join(','))
        })
      })
      break;
    case 2: // entire octave
      if(gangType === 1) {
        keyIndexes.forEach(keyIndex => overrideSensors.push([gangType,bankIndex,octave,keyIndex,side,0,sensorValue].join(',')))
      } else {
        keyIndexes.forEach(keyIndex => {
          sideIndexes.forEach(sideIndex => {
            sensorIndexes.forEach(sensorIndex => {
              overrideSensors.push([gangType,bankIndex,octave,keyIndex,sideIndex,sensorIndex,sensorValue].join(','))
            })
          })
        })
      }
      break;
    case 3: // entire device
      if(gangType === 1) {
        octaveIndexes.forEach(octaveIndex => {
          keyIndexes.forEach(keyIndex => overrideSensors.push([gangType,bankIndex,octaveIndex,keyIndex,side,0,sensorValue].join(',')))
        })
      } else {
        octaveIndexes.forEach(octaveIndex => {
          keyIndexes.forEach(keyIndex => {
            sideIndexes.forEach(sideIndex => {
              sensorIndexes.forEach(sensorIndex => {
                overrideSensors.push([gangType,bankIndex,octaveIndex,keyIndex,sideIndex,sensorIndex,sensorValue].join(','))
              })
            })
          })
        })
      }
      break;
    default:

  }

  return (dispatch) => {
    overrideSensors.forEach(sensorParam => {
      const sensorID = sensorParam.split(',').slice(0,-1).join(','),
            sensorValue = sensorParam.split(',').slice(-1)[0]

      dispatch({ type: SET_OVERRIDE_SENSOR, sensor: sensorID, value: Number(sensorValue) })
      dispatch({ type: SET_KEY_SENSOR, ...buildSensorObject(sensorParam) })
    })
  }
}

export const removeOverrideSensor = (sensorID) => {
  return (dispatch) => {
    dispatch({type: REMOVE_OVERRIDE_SENSOR, id: sensorID})
  }
}
export const revertSensorState = (overrides) => {
  return (dispatch) => {
    dispatch({type: REVERT_SENSOR_STATE, overrides: overrides})
  }
}
