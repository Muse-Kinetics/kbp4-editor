// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React from 'react'
import { connect } from 'react-redux'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import "./TabbedSections.css";

import Keys from './Keys'
import SlidersPedals from './SlidersPedals'
import AdvancedSettings from './AdvancedSettings'

import tooltips from '../constants/tooltips.json'

const TabbedSections = (props) => {
  return (
    <Tabs>
      <TabList>
        <Tab
          data-tip={tooltips['editor-tab-keys-zones']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!props.showTooltips}
          >Keys & Zones</Tab>
        <Tab
          data-tip={tooltips['editor-tab-sliders-pedals']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!props.showTooltips}
          >Sliders & Pedals</Tab>
        <Tab
          data-tip={tooltips['editor-tab-advanced']}
          data-multiline="true"
          data-place="top"
          data-tip-disable={!props.showTooltips}
          >Advanced</Tab>
      </TabList>

      <TabPanel>
        <Keys />
      </TabPanel>
      <TabPanel>
        <SlidersPedals />
      </TabPanel>
      <TabPanel>
        <AdvancedSettings />
      </TabPanel>
    </Tabs>
  )
}

const mapStateToProps = (state) => {
  return {
    showTooltips: state.editorPreferences.showTooltips
  }
}

export default connect(mapStateToProps, null)(TabbedSections)
