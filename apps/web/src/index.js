// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './index.css';

import Editor from './Editor';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';

const store = configureStore()
// dev
window.store = store

ReactDOM.render(
  <Provider store={ store }>
    <Editor />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
