// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import transform from 'lodash.transform';
import isEqual from 'lodash.isequal';
import isObject from 'lodash.isobject';

export function buildSensorObject(data) {
  const keys = ['gangType','bankIndex', 'octave', 'key', 'side', 'sensor', 'sensorgain'],
  values = data.split(',')

  return keys.reduce((paramObject,v,i,k) => {
    paramObject[v] = Number(values[i])
    return paramObject
  }, {})
}


export function getKeySensor(id) {
  const itemMatch = id.match(/(K\d+)_([L|R]\d)/)

  if(itemMatch) {
    return {
      key: Number(itemMatch[1].replace('K','')),
      side: itemMatch[2].includes('L') ? 0 : 1,
      sensor: Number(itemMatch[2].replace('L','').replace('R',''))
    }
  }

  return false
}

export function findSensorValue(sensorID, keySensors) {
  const [gang, bank, octave, key, side, sensor] = sensorID.split(',')

  return keySensors[gang === '1' ? 'ganged_12' : 'ganged_2'][bank][octave][key][side][sensor]
}

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export function getObjectDiff(object, base) {
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key])) {
      result[key] = isObject(value) && isObject(base[key]) ? getObjectDiff(value, base[key]) : value;
    }
  })
}
