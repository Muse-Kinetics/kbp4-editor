// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import Slider from 'react-compound-slider'
import debounce from 'lodash.debounce'

import Handle from './SliderComponents/Handle'
import Track from './SliderComponents/Track'

import './SplitSlider.css'

import { keyCollision } from '../../utilities'
import offsets from '../../constants/keyOffsets'
import tooltips from '../../constants/tooltips.json'

import {
  setZoneSplitKey
} from '../../actions/'

// move into CSS
const sliderStyle = {
  position: 'relative',
  width: '100%',
  paddingTop: 3,
  marginTop: 15,
  backgroundColor: '#333'
}

class SplitSlider extends Component {
  state = {
    domain: [0, 974]
  }

  componentDidMount() {
    window.offsets = offsets
    this.setState({
      domain: [0, document.querySelector('#KBoardPro4Keys').getBoundingClientRect().width]
    })
  }

  render() {
    const {
      name,
      label,
      splitPoint,
      onSetSplitKey,
      autohideZoneBackground,
      showTooltips,
    } = this.props

    let handlePos = (splitPoint > 47) ? 0 : parseInt(offsets[47 - splitPoint].x) + parseInt(offsets[47 - splitPoint].width)

    return (
      <div
        className={
          classnames(
            "split-slider",
            name,
            {"autohide": autohideZoneBackground}
          )
        }
        data-tip={tooltips['editor-splits']}
        data-multiline="true"
        data-place={name === 'zone-a' ? 'top' : 'bottom'}
        data-tip-disable={!showTooltips}
        >
        <div style={{ height: 10, width: '100%' }}>
        <Slider
          step={1}
          domain={this.state.domain}
          rootStyle={sliderStyle}
          onUpdate={debounce((values) => {
              // get split point
              let splitKey = keyCollision(document.querySelector('.split-line'), document.querySelectorAll('#KBoardPro4Stems path'))
              // handle undefined values when in between keys
              splitKey = (splitKey) ? splitKey : splitPoint
              // only update if new value
              if(splitPoint !== splitKey) onSetSplitKey(splitKey)
            }
          , 5)}
          values={[handlePos]}
          reversed={true}
        >
          <Slider.Rail>
            {({ getRailProps }) => (
              <div className='slider-rail' {...getRailProps()} />
            )}
          </Slider.Rail>
          <Slider.Handles>
            {({ handles, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map(handle => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    domain={this.state.domain}
                    label={label}
                    splitKey={splitPoint}
                    showTooltip={showTooltips}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Slider.Handles>
          <Slider.Tracks>
            {({ tracks, getTrackProps }) => (
              <div className="slider-tracks">
                {tracks.map(({ id, source, target }) => (
                  <Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />
                ))}
              </div>
            )}
          </Slider.Tracks>
        </Slider>
      </div>
    </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    splitPoint: state.currentPreset.zone_split_key_num,
    autohideZoneBackground: state.editorPreferences.autohideZoneBackground,
    showTooltips: state.editorPreferences.showTooltips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetSplitKey: (key) => {
      dispatch(setZoneSplitKey(~~key))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplitSlider)
