// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import isPlainObject from 'lodash.isplainobject'
import intersectionBy from 'lodash.intersectionby'

import presetParams from '../components/presetBuilding/constants/presetParams'

import { capitalize } from './'

const specialParams = {
  'keys': 'key_axis',
  'pedals': 'pedal',
  'sliders': 'slider'
}

export function buildMessage(difference, preset, zone) {
  const diffKey = Object.keys(difference).toString(),
        diffValue = difference[diffKey]
  let messagePayload = ''

  if(isPlainObject(diffValue)) {
    const index = Object.keys(difference[diffKey])

    return index.map((i) => {
  		if(presetParams['zone_globals'].params.includes(diffKey)) {
  			messagePayload = presetParams['zone_globals'].params.map(k => {
          if(k.includes('reserved')) {
            return 0
          } else {
            return (k === diffKey) ? diffValue[zone] : preset[k][zone]
          }
  			})
  		} else if(diffKey === 'pitch_bend') {
  			messagePayload = Object.keys(preset[diffKey]).map(k => preset[diffKey][k][zone])
  		} else {
  			messagePayload = Object.keys(preset[diffKey][~~i]).reduce((arr, key) => {
  				if(diffKey === 'sliders' || diffKey === 'pedals') {
  					arr.push(preset[diffKey][~~i][key]);
  				} else { // key axis
  					arr.push(preset[diffKey][~~i][key][zone]);
  				}

  				return arr
  			}, [])
  		}

  		if(diffKey === 'sliders' || diffKey === 'pedals') {
  			return [formatParamSendName(diffKey), [i].concat(messagePayload).toString()]
  		} else if(presetParams['zone_globals'].params.includes(diffKey)) {
  			return ['zone_globals', [zone, ...messagePayload].join(',')]
  		} else if(diffKey === 'pitch_bend') {
  			return ['pitch_bend', [zone, ...messagePayload].join(',')]
  		} else {
  			return [formatParamSendName(diffKey), [zone,i].concat(messagePayload).toString()]
  		}
    })
  } else {
    // single param
		if(presetParams['globals'].params.includes(diffKey)) {
			messagePayload = [...presetParams['globals'].params].slice(3).map(k => {
				return (k === diffKey) ? diffValue : preset[k]
			})
		}

		if(presetParams['globals'].params.includes(diffKey)) {
			return [
        ['globals', messagePayload.join(',')]
      ]
		} else {
			return [
        [formatParamSendName(diffKey), messagePayload.toString()]
      ]
		}
  }

}


export function isUserPreset(preset) {
	return preset.includes('user')
}

function formatParamSendName(name) {
	return specialParams[name] ? specialParams[name]: name;
}

export function uniquePresetNames(presets) {
  const allNames = Object.keys(presets).map(cat => {
  	return presets[cat].map(n => n.name)
  }).flat()

  const count = names => names.reduce((a, b) => Object.assign(a, {[b]: (a[b] || 0) + 1}), {})

  const duplicates = dict => Object.keys(dict).filter((a) => dict[a] > 1)

  return duplicates(count(allNames)).length <= 0
}

export function getPresetFromID(presets, presetID){
  const [category, index] = presetID.split('-')

  return presets[category][~~index]
}

export function reduceParamObject(param, index = null) {
	return Object.keys(param).reduce((messageArr, key) => {
		messageArr.push(param[key].toString())
		return messageArr
	}, index!=null ? [index] : []).toString()
}

export function reduceParamArray(param, index) {
  return reduceParamObject(param[index], index)
}

export function getOriginPreset(state) {
  const selectdPresetKey = state.editor.selectedPreset, // 'user-0'
        category = selectdPresetKey.split('-')[0], // 'user'
        index = selectdPresetKey.split('-')[1] // 0

  return state.presets[category][index]
}

export function buildPresetMenu(presets) {
  return Object.keys(presets).reduce(
    (menuItems, category) => {
      if(presets[category].length){
        menuItems.push({
          title: capitalize(category),
          id: category,
          options: buildPresetMenuOptions(category, presets[category])
        })
      }
      return menuItems
    }, [])
}

function buildPresetMenuOptions(category, presets) {
  return presets.map(
    (preset, index) => {
      return {
        value: `${category}-${index}`,
        label: (category === 'device') ? 'on-device: ' + preset.name : category + ': ' + preset.name
      }
    }
  )
}

export function getNextPreset(name, presets) {
	const deleteIndex = presets.user.findIndex(element => element.name === name)

	let newPresetID, newSelectPresetID
	// load next preset
	if(presets.user.length > 1) { // if there are at least 2 preset left
		if(deleteIndex === 0) { // delete first preset
			newPresetID = `user-1`
			newSelectPresetID = `user-0`
		} else if(deleteIndex === presets.user.length - 1) { // delete last preset
			newSelectPresetID = newPresetID = `user-${deleteIndex - 1}`
		} else { // delete middle presets
			newPresetID = `user-${deleteIndex + 1}`
			newSelectPresetID = `user-${deleteIndex}`
		}
	} else if(presets.device.length) {
		newSelectPresetID = newPresetID = 'device-0'
	} else if(presets.factory.length) {
		newSelectPresetID = newPresetID = 'factory-0'
	}

	return {
		nextSelectPresetID: newSelectPresetID,
		nextPreset: getPresetFromID(presets, newPresetID)

	}
}

export function deviceVersions(data) {
  return {firmware: data.peripheral_firmware, bootloader: data.peripheral_bootloader}
}

export function getDuplicates(storedPresets, importedPresets) {
	return intersectionBy(storedPresets, importedPresets, 'name').reduce((presets, preset, index) => {
		presets[index] = preset.name

		return presets
	}, {});
}

export function exportLocalStorage() {
	const presets = JSON.parse(localStorage.getItem('k-board-pro-4_presets.user')),
				a = document.createElement('a')

	a.setAttribute('href', 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(presets, null, 2)));
	a.setAttribute('download', 'k-board-pro-4-user-presets.json');
	a.click()
}
