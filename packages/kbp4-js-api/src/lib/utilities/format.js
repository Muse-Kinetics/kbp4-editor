// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
export function groupArray(arr, n) {
  return arr.reduce((p, cur, i) => {
    (p[i/n|0] = p[i/n|0] || []).push(cur);
    return p;
  },[]);
}

export function chunkArray(arr, n) {
  return arr.reduce((chunked,one,i) => {
   const chi = Math.floor(i/n); // chunk index
   chunked[chi] = [].concat((chunked[chi]||[]),one);
   return chunked
  }, [])
}

export function capitalize(string) {
  return string.toLowerCase().replace( /\b\w/g, (m) => m.toUpperCase())
}

// lower_case --> camelCase
export function underToCamel(string){
  return string.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
}
// lower_case --> camelCase
export function camelToUnder(string){
  return string.replace(/([a-z][A-Z])/g, (g) => g[0] + '_' + g[1].toLowerCase())
}

export function logIf(condition, message, type) {
  if(condition) console[type ? type : 'log'](message)
}
