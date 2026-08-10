// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import { isOdd, isEven, isObject } from './test'

export function paramObjectFactory(key, value){
  return {
    param: key,
    values: value
  }
}

export function flattenZonedParam(zonedParam){
  return Object.values(zonedParam).flat()
}

export function groupFlatParam(flatArray) {
  return [
    flatArray.filter(isEven),
    flatArray.filter(isOdd)
  ]
}

export function buildZonedParamObjects(paramName, paramObjects) {
	return paramObjects.map((item, itemIndex) => {
		const flattened = flattenZonedParam(item),
				  grouped = groupFlatParam(flattened),
				  zonedGroups = prependZoneIndex(grouped, itemIndex)

    return zonedGroups
	})
	.flat()
	.map(values => paramObjectFactory(paramName, values.toString()))
}

function prependZoneIndex(array, item){
	return array.map((currentItem, index) => {
			return [index, item].concat(...currentItem)
	})
}


export function buildPitchBendParam(objectGroup){
	const zones = [0,1],
        flatValues = flattenZonedParam(objectGroup),
        paramGroups = groupFlatParam(flatValues)

  return zones.map(zone => {
    let values = [zone].concat(paramGroups[zone])

    return paramObjectFactory('pitch_bend', values.toString())
  })
}

export function formatParamSendName(name) {
	return specialParamList.includes(name) ? name.substring(0, name.length-1): name;
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

export function buildParamObject(key, values) {
  if(isObject(values[0])){
    return values.reduce((o,p,i) => {
      o[i] = paramObjectFactory(key, reduceParamObject(p, i))

      return o
    }, [])
  } else {
    return [paramObjectFactory(key, values.toString())]
  }
}

export function buildSimpleZonedParam(key, values){
  return values.reduce((o,p,i) => {
    o[i] = paramObjectFactory(key, p.toString())

    return o
  }, [])
}

export function buildZonedGlobalParam(zonedGroup){
  return [0,1].map(zone => {
    const values = [zone].concat(zonedGroup.map((p) => p.values[zone])).join(',')
    return paramObjectFactory('zone_globals', values)
  })
}

export function buildGlobalParam(group){
  const values = group.reduce((globals, param) => {
	if(Array.isArray(param.values)){
		globals.push(...param.values)
    } else {
		globals.push(param.values)
	}

	return globals
}, [])

  return paramObjectFactory('globals', values.toString())
}
