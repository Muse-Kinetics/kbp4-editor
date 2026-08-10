// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import initialState from '../reducers/initialState'

import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { save, load } from 'redux-localstorage-simple'

import rootReducer from '../reducers/rootReducer'
import presetDiff from '../middleware/presetDiff'

const composeEnhancers = typeof window === 'object'
  && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ?  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

export default function configureStore() {
  return createStore(
    rootReducer,
    load(
      { states: ["presets.user", "userCurves", "editorPreferences"],
        namespace: "k-board-pro-4",
        preloadedState: initialState,
        disableWarnings: true
      }
    ),
    composeEnhancers(
      applyMiddleware(
        thunk,
        presetDiff,
        save(
          { states: ["presets.user", "userCurves", "editorPreferences"],
            namespace: "k-board-pro-4"
          }
        )
      )
    )
  );
}
