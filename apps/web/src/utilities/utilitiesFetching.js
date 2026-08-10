// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
export async function asyncFetchJSON(url) {
  const options = window.location.hostname === 'localhost' ? {} : {headers: {'Cache-Control': 'no-cache'}}
  try {
    let response = await fetch(url, options)
    if (response.ok) return await response.json()
  } catch(err) {
    console.warn(`>> K-Board Pro 4: could not fetch resource, due to network issues, ${err}`);
    return false;
  }
}

export async function asyncFetchBuffer(url) {
  const options = window.location.hostname === 'localhost' ? {} : {headers: {'Cache-Control': 'no-cache'}}
  try {
    let response = await fetch(url, options)
    if (response.ok) return await response.arrayBuffer()
  } catch(err) {
    console.warn(`>> K-Board Pro 4: could not fetch resource, due to network issues, ${err}`);
    return false;
  }
}

// old-school method that allows fetching of local files
export function getJSON(url) {
  return new Promise((accept, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.responseType = 'json';
    xhr.onload = () => (xhr.status === 200) ? accept(xhr.response) : reject(xhr.status)
    xhr.send();
  })
};

export function getBuffer(url) {
  return new Promise((accept, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => (xhr.status === 200) ? accept(xhr.response) : reject(xhr.status)
    xhr.send();
  })
};
