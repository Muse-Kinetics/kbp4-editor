// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import presetModel from './constants/presetBuilderModel'
import presetParams from './constants/presetParams'
import specialParams from './constants/specialParams'

export default class PresetBuilder {
  constructor() {
    this._preset = Object.assign({}, presetModel)
  }

  _buildParam(paramObject) {
    const formattedParam = formatParam(paramObject)

    return {
      key: formattedParam.param,
      index: getParamIndex(formattedParam),
      zone: getParamZone(formattedParam),
      member: this._buildParamMember(formattedParam)
    }
  }

  _buildParamMember(paramObject) {
    const paramKeys = presetParams[paramObject.param].params
    const { values } = cleanParamValues(paramObject)

    return values.reduce((o,v,i) => {
      if(paramKeys[i] === 'preset_version') {
        o[paramKeys[i]] = values.map(Number).slice(0,4)
      } else if(paramKeys[i] === 'name') {
        o[paramKeys[i]] = v
      } else if(paramKeys[i] === 'gain') {
        o[paramKeys[i]] = v
      } else {
        o[paramKeys[i]] = Number(v)
      }

      return o
    }, {})
  }
// if globals || zone_globals; spread to preset
  _addToPreset(paramMember){
    const { key, zone, index, member } = paramMember

    switch (index) {
      case -2: // pitchBend
        if(zone === '0'){
          this._preset[key] = Object.keys(member).reduce((zonedParam, memberKey) => {
            zonedParam[memberKey] = [member[memberKey]]
            return zonedParam
          }, {})
        } else {
          Object.keys(this._preset[key]).forEach(k => {
            this._preset[key][k][zone] = member[k]
          })
        }
        break;
      case -1: // single params
        if(zone !== -1) { // zone globals
          if(zone === '0') {
            Object.keys(member).forEach(k => this._preset[k] = [member[k]])
          } else {
            Object.keys(member).forEach(k => this._preset[k][zone] = member[k])
          }
        } else { // globals
          Object.keys(member).forEach(k => this._preset[k] = member[k])
        }

        break;
      default: // groups [keys, pedals, sliders]
      if(zone !== -1) {
        if(isObject(this._preset[key][index])) {
          const zoneZeroParam = {...this._preset[key][index]}
          // console.log('zone', zone, 'member', zoneZeroParam);
          this._preset[key][index] = Object.keys(zoneZeroParam).reduce((zonedParam, memberKey) => {
              zonedParam[memberKey] = [
                zoneZeroParam[memberKey],
                member[memberKey]
              ]
              return zonedParam
            },{})
        } else {
          this._preset[key] = [
            ...this._preset[key].slice(0, index),
            member,
            ...this._preset[key].slice(index)
          ]
        }
      } else {
        this._preset[key] = [
          ...this._preset[key].slice(0, index),
          member,
          ...this._preset[key].slice(index)
        ]
      }
    }
  }

  add(paramObj) {
    this._addToPreset(this._buildParam(paramObj))
  }

  get() {
    const buildPreset = this._preset
    this._preset = {}
    return buildPreset
   }
}

function getParamIndex(paramObject) {
  if(isParamIndexed(paramObject)) {
    if(isParamZoned(paramObject)) {
      return ~~paramObject.values[1]
    } else {
      return ~~paramObject.values[0]
    }
  } else {
    return paramObject.param === 'pitch_bend' ? -2 : -1
  }
}

function isParamIndexed(paramObject) {
  return presetParams[paramObject.param].indexed
}
function isParamZoned(paramObject) {
  return presetParams[paramObject.param].zoned
}

function getParamZone(paramObject) {
  return isParamZoned(paramObject) ? paramObject.values[0] : -1;
}

function formatParam(paramObject){
  return {
    param: formatParamName(paramObject),
    values: formatParamValues(paramObject)
  }
}

// use this to get zone, index and values
function cleanParamValues(paramObject){
  const isZoned = presetParams[paramObject.param].zoned
  const isIndexed = presetParams[paramObject.param].indexed
  let zone, index, values

  if(isZoned) { // isZoned, isZoned && isIndexed, isZoned && !isIndexed
    if(isIndexed) {
      // keys
      [zone, index, ...values] = paramObject.values
      // console.log('>> keys:', values);
    } else {
      // pitch_bend, zone_globals
      // console.log('>> ' + paramObject.param + ':', paramObject.values);
      [zone, ...values] = paramObject.values
    }
  } else if(isIndexed) { // isIndexed, !isZoned & isIndexed
    // slider, pedal
    [index, ...values] = paramObject.values
  } else { // !isZoned & !isIndexed
    // name, globals
    values = paramObject.values
    // console.log('>> name/globals:', paramObject.values);
  }

  return {
    zone,
    index,
    values
  }
}
function formatParamName(paramObject){
  return (specialParams[paramObject.param]) ? specialParams[paramObject.param] : paramObject.param
}

function formatParamValues(paramObject){
  return (paramObject.param !== 'name') ? paramObject.values.split(',') : [paramObject.values]
}

function isObject(val) {
	return val != null && typeof val === 'object' && Array.isArray(val) === false;
}
