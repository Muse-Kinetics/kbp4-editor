// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import {
NETWORK_CONNECTION
} from '../actions/actionTypes'

const networkConnection = store => next => action => {
  const result = next(action)

  if(navigator.onLine){
    store.dispatch({type: NETWORK_CONNECTION, state: true})
  } else {
    store.dispatch({type: NETWORK_CONNECTION, state: false})
  }

  return result
}

export default networkConnection
