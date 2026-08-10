// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import isElectron from 'is-electron'
import isWindows from 'is-windows'
import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip'
import ReactModal from 'react-modal'
import classnames from 'classnames'
// components
import EditorHeader from './components/EditorHeader'
import EditorBody from './components/EditorBody'
import KBoardPro4Listener from './components/device/KBoardPro4Listener'
// modals
import './components/UI/ReactModal.css'
import VelocityCurves from './components/VelocityCurves'
import KeyGain from './components/KeyGain'
import Preferences from './components/Preferences'
import PresetsImportRenameDialog from './components/PresetsImportRenameDialog'
import FirmwareUpdateProgress from './components/FirmwareUpdateProgress'

class App extends Component {
  componentDidMount(){
    ReactModal.setAppElement('#root')
  }

  render() {
    return (
      <div className={
        classnames(
          'editor',
          {'electron': isElectron()},
          {'windows': isElectron() ? isWindows() : window.navigator.platform.includes('Win')},
          // desktop macOS only: the frameless window overlays the traffic-light
          // buttons on the content, so shift the editor down to clear them.
          {'mac': isElectron() && !isWindows() && window.navigator.platform.includes('Mac')}
        )
      }>
        <KBoardPro4Listener />
        <EditorHeader />
        <EditorBody />
        <VelocityCurves />
        <KeyGain />
        <Preferences />
        <PresetsImportRenameDialog />
        <FirmwareUpdateProgress />
        <ReactTooltip
          place="bottom"
          type="light"
          effect="solid"
          clickable={false}
        />
      </div>
    );
  }
}

export default App;
