// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react'

// import Nexus from 'nexusui'
// import ReactTooltip from 'react-tooltip'
// import classnames from 'classnames'

class KeyGainKeySensorSVG extends Component {
  // partial fill
  // https://stackoverflow.com/questions/29368138/outlining-and-partially-filling-an-svg-shape
/*
  handleClick = () => {
    const target = e.target.id

    if(target.includes('key_')) {
      // clear active class
      document.querySelectorAll('#keySensors path').forEach(p => p.classList.remove('active'))
      document.querySelectorAll('#keySensors rect').forEach(s => s.classList.remove('active'))
      // add active class
      document.querySelector(`#${target}`).classList.add('active')

      if(this.state.selectedKey === -1) return

      this.setState({
        selectedKey: ~~target.replace('key_',''),
        selectedKeyGain: this.props.keySensors.ganged_12[0][this.state.selectedOctave][this.state.selectedKey][this.state.selectedSensorSide][0] || 0,
        selectedSensorSide: 0,
        selectedSensor: -1
      })

      // set initialOverrides for reverting
      if(Object.keys(this.state.initialOverrides).length === 0 && this.props.keySensors.sensorsLoaded) this.setState({initialOverrides: this.props.keySensors.overrides})
    } else if(target.includes('sensor_')) {
      // clear active class
      document.querySelectorAll('#keySensors g').forEach(p => p.classList.remove('active'))
      document.querySelectorAll('#keySensors path').forEach(p => p.classList.remove('active'))
      document.querySelectorAll('#keySensors rect').forEach(s => s.classList.remove('active'))
      // add active class
      document.querySelector(`#${target}`).classList.add('active')
      // keySensors.ganged_2[1][this.state.selectedOctave][this.state.selectedKey][this.state.selectedSensorSide][this.state.selectedSensor]
      const keySensor = getKeySensor(target),
            keyGain = this.props.keySensors.ganged_12[0][this.state.selectedOctave][keySensor.key][0][0],
            sensorGain = this.props.keySensors.ganged_2[0][this.state.selectedOctave][keySensor.key][keySensor.side][keySensor.sensor],
            sensorMax = this.props.keySensors.ganged_2[1][this.state.selectedOctave][keySensor.key][keySensor.side][keySensor.sensor]

      this.setState({
        selectedKey: ~~keySensor.key,
        selectedKeyGain: keyGain,
        selectedSensorSide: ~~keySensor.side,
        selectedSensor: ~~keySensor.sensor,
        selectedSensorGain: sensorGain,
        selectedSensorMax: sensorMax
      }, function() {
        // can probably remove one of these
        if(this.state.selectedKey) document.querySelector(`#key_sensors_${keySensor.key}`).classList.add('active')
        if(this.state.selectedKey) document.querySelector(`#key_${keySensor.key}`).classList.add('active')
      })
      // set initialOverrides for reverting
      if(Object.keys(this.state.initialOverrides).length === 0 && this.props.keySensors.sensorsLoaded) this.setState({initialOverrides: this.props.keySensors.overrides})
    } else {
      // clear active class
      document.querySelectorAll('#keySensors g').forEach(p => p.classList.remove('active'))
      document.querySelectorAll('#keySensors path').forEach(p => p.classList.remove('active'))
      document.querySelectorAll('#keySensors rect').forEach(s => s.classList.remove('active'))

      this.setState({
        selectedKey: -1,
        selectedSensorSide: -1,
        selectedSensor: -1
      })
    }
  }
*/
  render() {

    return (
      <svg id="keySensors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 431.8 367.8" onClick={this.props.onClick}>
        <g id="key_sensors_11" className="key white">
          <path id="key_11" className="key" d="M376.1,365.8V240.1c-0.1-0.9,0.7-1.3,1.4-1.5h24.1c0.8,0,1.4-0.6,1.4-1.3c0,0,0,0,0-0.1V1.9
          c0-1,0.7-1.1,1.4-1.4h25.5c0.3,0.2,0.7,0.1,1,0.4s0.2,0.7,0.4,1v363.9c-0.3,0.6-0.4,1.5-1.4,1.4h-52.4
          C376.8,367.2,376,366.5,376.1,365.8z"/>
        	<rect id="sensor_K11_L0" data-key-type="white" x="378.5" y="305.7" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K11_L1" data-key-type="white" x="378.5" y="240.9" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K11_L2" data-key-type="white" x="404.6" y="183" className="sensor" width="12" height="53.5"/>
        	<rect id="sensor_K11_L3" data-key-type="white" x="404.6" y="123.4" className="sensor" width="12" height="55"/>
        	<rect id="sensor_K11_L4" data-key-type="white" x="404.6" y="63.7" className="sensor" width="12" height="55"/>
        	<rect id="sensor_K11_L5" data-key-type="white" x="404.6" y="4.8" className="sensor" width="12" height="55"/>
        	<rect id="sensor_K11_R0" data-key-type="white" x="404.5" y="305.7" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K11_R1" data-key-type="white" x="404.5" y="240.9" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K11_R2" data-key-type="white" x="417.6" y="183" className="sensor" width="12" height="53.5"/>
        	<rect id="sensor_K11_R3" data-key-type="white" x="417.6" y="123.4" className="sensor" width="12" height="55"/>
        	<rect id="sensor_K11_R4" data-key-type="white" x="417.6" y="63.7" className="sensor" width="12" height="55"/>
        	<rect id="sensor_K11_R5" data-key-type="white" x="417.6" y="4.8" className="sensor" width="12" height="55"/>
        </g>
        <g id="key_sensors_10" className="key blue">
          <path id="key_10" className="key" d="M391.7,230.1H369c-1.7,0-2.6-1.2-2.9-2.8V3.4c0.1-0.7,0.4-1.5,0.9-2c0.5-0.6,1.2-0.9,2-0.9h22.7
          c1.5,0.1,2.7,1.4,2.8,2.9v223.9C394.2,228.8,393.4,230.1,391.7,230.1z"/>
        	<rect id="sensor_K10_L2" data-key-type="blue" x="368.2" y="176.4" className="sensor" width="11.7" height="51.5"/>
        	<rect id="sensor_K10_L3" data-key-type="blue" x="368.2" y="119" className="sensor" width="11.7" height="52.9"/>
        	<rect id="sensor_K10_L4" data-key-type="blue" x="368.2" y="61.5" className="sensor" width="11.7" height="52.9"/>
        	<rect id="sensor_K10_L5" data-key-type="blue" x="368.2" y="4.8" className="sensor" width="11.7" height="52.9"/>
        	<rect id="sensor_K10_R2" data-key-type="blue" x="381" y="176.4" className="sensor" width="11.7" height="51.5"/>
        	<rect id="sensor_K10_R3" data-key-type="blue" x="381" y="119" className="sensor" width="11.7" height="52.9"/>
        	<rect id="sensor_K10_R4" data-key-type="blue" x="381" y="61.5" className="sensor" width="11.7" height="52.9"/>
        	<rect id="sensor_K10_R5" data-key-type="blue" x="381" y="4.8" className="sensor" width="11.7" height="52.9"/>
        </g>
        <g id="key_sensors_9" className="key white">
          <path id="key_9" className="st1" d="M313.7,365.8V240.1c-0.1-0.9,0.7-1.3,1.4-1.5h15.6c0.8,0,1.4-0.6,1.4-1.3c0,0,0,0,0-0.1V1.9
          c0.2-0.3,0.1-0.7,0.4-1s0.7-0.2,1-0.4h22.7c0.4,0.2,0.7,0.1,1,0.4c0.3,0.3,0.4,0.6,0.4,1v235.3c0.2,0.4,0.1,0.7,0.5,1
          c0.3,0.2,0.6,0.4,1,0.4h7c0.4,0.1,0.7,0.2,1,0.5c0.4,0.4,0.3,0.6,0.5,1v125.7c-0.2,0.4-0.1,0.7-0.5,1c-0.3,0.3-0.6,0.4-1,0.4h-51
          C314.3,367.2,313.7,366.6,313.7,365.8C313.7,365.9,313.7,365.8,313.7,365.8z"/>
        	<rect id="sensor_K9_L0" data-key-type="white" x="315.5" y="305.7" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K9_L1" data-key-type="white" x="315.5" y="240.9" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K9_L2" data-key-type="white" x="334" y="183" className="sensor" width="10.5" height="53.5"/>
        	<rect id="sensor_K9_L3" data-key-type="white" x="334" y="123.4" className="sensor" width="10.5" height="55"/>
        	<rect id="sensor_K9_L4" data-key-type="white" x="334" y="63.7" className="sensor" width="10.5" height="55"/>
        	<rect id="sensor_K9_L5" data-key-type="white" x="334" y="4.8" className="sensor" width="10.5" height="55"/>
        	<rect id="sensor_K9_R0" data-key-type="white" x="341.5" y="305.7" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K9_R1" data-key-type="white" x="341.5" y="240.9" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K9_R2" data-key-type="white" x="345.5" y="183" className="sensor" width="10.5" height="53.5"/>
        	<rect id="sensor_K9_R3" data-key-type="white" x="345.5" y="123.4" className="sensor" width="10.5" height="55"/>
        	<rect id="sensor_K9_R4" data-key-type="white" x="345.5" y="63.7" className="sensor" width="10.5" height="55"/>
        	<rect id="sensor_K9_R5" data-key-type="white" x="345.5" y="4.8" className="sensor" width="10.5" height="55"/>
        </g>
        <g id="key_sensors_8" className="key blue">
          <path id="key_8" className="st2" d="M296.1,1.4c0.6-0.7,1.2-0.7,2-0.9h22.7c0.8,0.2,1.4,0.2,2,0.9c0.5,0.5,0.8,1.3,0.8,2v223.9
          c0,1.5-1.2,2.8-2.7,2.8c0,0-0.1,0-0.1,0h-22.7c-1.5,0-2.8-1.2-2.8-2.7c0,0,0-0.1,0-0.1V3.4C295.3,2.7,295.6,2,296.1,1.4z"/>
        	<rect id="sensor_K8_L2" data-key-type="blue" x="297.2" y="176.4" className="sensor" width="11.7" height="51.5"/>
        	<rect id="sensor_K8_L3" data-key-type="blue" x="297.2" y="119" className="sensor" width="11.7" height="52.9"/>
        	<rect id="sensor_K8_L4" data-key-type="blue" x="297.2" y="61.5" className="sensor" width="11.7" height="52.9"/>
        	<rect id="sensor_K8_L5" data-key-type="blue" x="297.2" y="4.8" className="sensor" width="11.7" height="52.9"/>
        	<rect id="sensor_K8_R2" data-key-type="blue" x="310" y="176.4" className="sensor" width="11.7" height="51.5"/>
        	<rect id="sensor_K8_R3" data-key-type="blue" x="310" y="119" className="sensor" width="11.7" height="52.9"/>
        	<rect id="sensor_K8_R4" data-key-type="blue" x="310" y="61.5" className="sensor" width="11.7" height="52.9"/>
        	<rect id="sensor_K8_R5" data-key-type="blue" x="310" y="4.8" className="sensor" width="11.7" height="52.9"/>
        </g>
        <g id="key_sensors_7" className="key white">
          <path id="key_7" className="st1" d="M251.3,365.8V240.1c0.2-0.4,0.1-0.7,0.5-1c0.3-0.3,0.6-0.4,1-0.5h7c0.7,0.1,1.4-0.4,1.5-1.1
          c0-0.1,0-0.2,0-0.3V1.9c-0.1-0.4,0.1-0.8,0.4-1c0.4-0.3,0.6-0.2,1-0.4h22.7c0.3,0.2,0.7,0.1,1,0.4s0.2,0.7,0.4,1v235.3
          c0,0.8,0.6,1.4,1.3,1.4c0,0,0,0,0.1,0h15.6c0.7,0.2,1.5,0.6,1.4,1.5v125.7c0,0.8-0.6,1.4-1.3,1.4c0,0,0,0-0.1,0h-51
          C251.8,367.3,251.6,366.4,251.3,365.8z"/>
        	<rect id="sensor_K7_L0" data-key-type="white" x="253.5" y="305.7" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K7_L1" data-key-type="white" x="253.5" y="240.9" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K7_L2" data-key-type="white" x="263" y="183" className="sensor" width="10.5" height="53.5"/>
        	<rect id="sensor_K7_L3" data-key-type="white" x="263" y="123.4" className="sensor" width="10.5" height="55"/>
        	<rect id="sensor_K7_L4" data-key-type="white" x="263" y="63.7" className="sensor" width="10.5" height="55"/>
        	<rect id="sensor_K7_L5" data-key-type="white" x="263" y="4.8" className="sensor" width="10.5" height="55"/>
        	<rect id="sensor_K7_R0" data-key-type="white" x="279.5" y="305.7" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K7_R1" data-key-type="white" x="279.5" y="240.9" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K7_R2" data-key-type="white" x="274.5" y="183" className="sensor" width="10.5" height="53.5"/>
        	<rect id="sensor_K7_R3" data-key-type="white" x="274.5" y="123.4" className="sensor" width="10.5" height="55"/>
        	<rect id="sensor_K7_R4" data-key-type="white" x="274.5" y="63.7" className="sensor" width="10.5" height="55"/>
        	<rect id="sensor_K7_R5" data-key-type="white" x="274.5" y="4.8" className="sensor" width="10.5" height="55"/>
        </g>
        <g id="key_sensors_6" className="key blue">
          <path id="key_6" className="st2" d="M249.9,230.1h-22.7c-1.7,0-2.5-1.3-2.8-2.8V3.4c0.1-1.5,1.3-2.8,2.8-2.9h22.7
          c1.6,0.1,2.8,1.3,2.9,2.9v223.9C252.5,228.8,251.6,230.1,249.9,230.1z"/>
        	<rect id="sensor_K6_L2" data-key-type="blue" x="226.2" y="176.4" className="sensor" width="12" height="51.5"/>
        	<rect id="sensor_K6_L3" data-key-type="blue" x="226.2" y="119" className="sensor" width="12" height="52.9"/>
        	<rect id="sensor_K6_L4" data-key-type="blue" x="226.2" y="61.5" className="sensor" width="12" height="52.9"/>
        	<rect id="sensor_K6_L5" data-key-type="blue" x="226.2" y="4.8" className="sensor" width="12" height="52.9"/>
        	<rect id="sensor_K6_R2" data-key-type="blue" x="239.3" y="176.4" className="sensor" width="12" height="51.5"/>
        	<rect id="sensor_K6_R3" data-key-type="blue" x="239.3" y="119" className="sensor" width="12" height="52.9"/>
        	<rect id="sensor_K6_R4" data-key-type="blue" x="239.3" y="61.5" className="sensor" width="12" height="52.9"/>
        	<rect id="sensor_K6_R5" data-key-type="blue" x="239.3" y="4.8" className="sensor" width="12" height="52.9"/>
        </g>
        <g id="key_sensors_5" className="key white">
          <path id="key_5" className="st1" d="M190.4,0.5h24.1c0.6,0.3,1.5,0.4,1.4,1.4v235.3c0,0.8,0.6,1.4,1.3,1.4c0,0,0,0,0.1,0h24.1
          c0.7,0.2,1.5,0.6,1.4,1.5v125.7c0,0.8-0.6,1.4-1.3,1.4c0,0,0,0-0.1,0h-51c-0.8,0-1.4-0.6-1.4-1.3c0,0,0,0,0-0.1V1.9
          C189,0.9,189.7,0.8,190.4,0.5z"/>
        	<rect id="sensor_K5_L0" data-key-type="white" x="190.6" y="305.7" className="sensor" width="24.3" height="60"/>
        	<rect id="sensor_K5_L1" data-key-type="white" x="190.6" y="240.9" className="sensor" width="24.3" height="60"/>
        	<rect id="sensor_K5_L2" data-key-type="white" x="190.6" y="183" className="sensor" width="11.3" height="53.5"/>
        	<rect id="sensor_K5_L3" data-key-type="white" x="190.6" y="123.4" className="sensor" width="11.3" height="55"/>
        	<rect id="sensor_K5_L4" data-key-type="white" x="190.6" y="63.7" className="sensor" width="11.3" height="55"/>
        	<rect id="sensor_K5_L5" data-key-type="white" x="190.6" y="4.8" className="sensor" width="11.3" height="55"/>
        	<rect id="sensor_K5_R0" data-key-type="white" x="217.1" y="305.7" className="sensor" width="24.3" height="60"/>
        	<rect id="sensor_K5_R1" data-key-type="white" x="217.1" y="240.9" className="sensor" width="24.3" height="60"/>
        	<rect id="sensor_K5_R2" data-key-type="white" x="202.9" y="183" className="sensor" width="11.3" height="53.5"/>
        	<rect id="sensor_K5_R3" data-key-type="white" x="202.9" y="123.4" className="sensor" width="11.3" height="55"/>
        	<rect id="sensor_K5_R4" data-key-type="white" x="202.9" y="63.7" className="sensor" width="11.3" height="55"/>
        	<rect id="sensor_K5_R5" data-key-type="white" x="202.9" y="4.8" className="sensor" width="11.3" height="55"/>
        </g>
        <g id="key_sensors_4" className="key white">
          <path id="key_4" className="st1" d="M126.6,365.8V240.1c-0.1-0.9,0.8-1.2,1.4-1.5h21.3c0.8,0,1.4-0.6,1.4-1.3c0,0,0,0,0-0.1V1.9
          c0-0.4,0.2-0.7,0.4-1c0.3-0.3,0.7-0.2,1-0.4h27c0.3,0.2,0.7,0.1,1,0.4s0.2,0.7,0.4,1v363.9c-0.3,0.6-0.4,1.5-1.4,1.4H128
          C127.3,367.2,126.5,366.5,126.6,365.8z"/>
        	<rect id="sensor_K4_L0" data-key-type="white" x="128.5" y="305.7" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K4_L1" data-key-type="white" x="128.5" y="240.9" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K4_L2" data-key-type="white" x="152.7" y="183" className="sensor" width="12.3" height="53.5"/>
        	<rect id="sensor_K4_L3" data-key-type="white" x="152.7" y="123.4" className="sensor" width="12.3" height="55"/>
        	<rect id="sensor_K4_L4" data-key-type="white" x="152.7" y="63.7" className="sensor" width="12.3" height="55"/>
        	<rect id="sensor_K4_L5" data-key-type="white" x="152.7" y="4.8" className="sensor" width="12.3" height="55"/>
        	<rect id="sensor_K4_R0" data-key-type="white" x="154.5" y="305.7" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K4_R1" data-key-type="white" x="154.5" y="240.9" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K4_R2" data-key-type="white" x="166.1" y="183" className="sensor" width="12.3" height="53.5"/>
        	<rect id="sensor_K4_R3" data-key-type="white" x="166.1" y="123.4" className="sensor" width="12.3" height="55"/>
        	<rect id="sensor_K4_R4" data-key-type="white" x="166.1" y="63.7" className="sensor" width="12.3" height="55"/>
        	<rect id="sensor_K4_R5" data-key-type="white" x="166.1" y="4.8" className="sensor" width="12.3" height="55"/>
        </g>
        <g id="key_sensors_3" className="key blue">
          <path id="key_3" className="st2" d="M139.4,230.1h-22.7c-1.5,0-2.8-1.2-2.8-2.7c0,0,0-0.1,0-0.1V3.4c0-1.7,1.2-2.6,2.8-2.9h22.7
          c0.8,0,1.5,0.4,2,0.9c0.5,0.6,0.8,1.3,0.8,2v223.9C142.2,228.9,140.9,230.1,139.4,230.1L139.4,230.1z"/>
        	<rect id="sensor_K3_L2" data-key-type="blue" x="115.6" y="176.4" className="sensor" width="12" height="51.5"/>
        	<rect id="sensor_K3_L3" data-key-type="blue" x="115.6" y="119" className="sensor" width="12" height="52.9"/>
        	<rect id="sensor_K3_L4" data-key-type="blue" x="115.6" y="61.5" className="sensor" width="12" height="52.9"/>
        	<rect id="sensor_K3_L5" data-key-type="blue" x="115.6" y="4.8" className="sensor" width="12" height="52.9"/>
        	<rect id="sensor_K3_R2" data-key-type="blue" x="128.7" y="176.4" className="sensor" width="12" height="51.5"/>
        	<rect id="sensor_K3_R3" data-key-type="blue" x="128.7" y="119" className="sensor" width="12" height="52.9"/>
        	<rect id="sensor_K3_R4" data-key-type="blue" x="128.7" y="61.5" className="sensor" width="12" height="52.9"/>
        	<rect id="sensor_K3_R5" data-key-type="blue" x="128.7" y="4.8" className="sensor" width="12" height="52.9"/>
        </g>
        <g id="key_sensors_2" className="key white">
          <path id="key_2" className="st1" d="M64.3,365.8V240.1c-0.1-0.9,0.7-1.3,1.4-1.5h9.9c0.8,0,1.4-0.6,1.4-1.3c0,0,0,0,0-0.1V1.9
          c0-0.4,0.2-0.7,0.4-1c0.3-0.3,0.7-0.2,1-0.4h25.5c0.4,0.2,0.7,0.1,1,0.4c0.2,0.3,0.4,0.7,0.5,1v235.3c0,0.8,0.6,1.4,1.3,1.4
          c0,0,0,0,0.1,0h9.9c0.7,0.2,1.5,0.6,1.4,1.5v125.7c0,0.8-0.6,1.4-1.3,1.4c0,0,0,0-0.1,0h-51C65,367.2,64.2,366.5,64.3,365.8z"/>
        	<rect id="sensor_K2_L0" data-key-type="white" x="66.5" y="305.7" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K2_L1" data-key-type="white" x="66.5" y="240.9" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K2_L2" data-key-type="white" x="78.6" y="183" className="sensor" width="12" height="53.5"/>
        	<rect id="sensor_K2_L3" data-key-type="white" x="78.6" y="123.4" className="sensor" width="12" height="55"/>
        	<rect id="sensor_K2_L4" data-key-type="white" x="78.6" y="63.7" className="sensor" width="12" height="55"/>
        	<rect id="sensor_K2_L5" data-key-type="white" x="78.6" y="4.8" className="sensor" width="12" height="55"/>
        	<rect id="sensor_K2_R0" data-key-type="white" x="92.5" y="305.7" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K2_R1" data-key-type="white" x="92.5" y="240.9" className="sensor" width="23.8" height="60"/>
        	<rect id="sensor_K2_R2" data-key-type="white" x="91.7" y="183" className="sensor" width="12" height="53.5"/>
        	<rect id="sensor_K2_R3" data-key-type="white" x="91.7" y="123.4" className="sensor" width="12" height="55"/>
        	<rect id="sensor_K2_R4" data-key-type="white" x="91.7" y="63.7" className="sensor" width="12" height="55"/>
        	<rect id="sensor_K2_R5" data-key-type="white" x="91.7" y="4.8" className="sensor" width="12" height="55"/>
        </g>
        <g id="key_sensors_1" className="key blue">
          <path id="key_1" className="st2" d="M43,0.5h22.7c0.8,0,1.5,0.4,2,0.9c0.5,0.5,0.8,1.3,0.8,2v223.9c0,1.5-1.3,2.8-2.8,2.8h0H43
          c-1.5,0-2.8-1.2-2.8-2.7c0,0,0-0.1,0-0.1V3.4C40.2,1.9,41.4,0.6,43,0.5C43,0.5,43,0.5,43,0.5z"/>
        	<rect id="sensor_K1_L2" data-key-type="blue" x="42.2" y="176.4" className="sensor" width="11.7" height="51.5"/>
        	<rect id="sensor_K1_L3" data-key-type="blue" x="42.2" y="119" className="sensor" width="11.7" height="52.9"/>
        	<rect id="sensor_K1_L4" data-key-type="blue" x="42.2" y="61.5" className="sensor" width="11.7" height="52.9"/>
        	<rect id="sensor_K1_L5" data-key-type="blue" x="42.2" y="4.8" className="sensor" width="11.7" height="52.9"/>
        	<rect id="sensor_K1_R2" data-key-type="blue" x="55" y="176.4" className="sensor" width="11.7" height="51.5"/>
        	<rect id="sensor_K1_R3" data-key-type="blue" x="55" y="119" className="sensor" width="11.7" height="52.9"/>
        	<rect id="sensor_K1_R4" data-key-type="blue" x="55" y="61.5" className="sensor" width="11.7" height="52.9"/>
        	<rect id="sensor_K1_R5" data-key-type="blue" x="55" y="4.8" className="sensor" width="11.7" height="52.9"/>
        </g>
        <g id="key_sensors_0" className="key white">
          <path id="key_0" className="st1" d="M3.3,0.5h26.9c0.4,0.2,0.7,0.1,1,0.4s0.3,0.7,0.5,1v235.3c0,0.8,0.6,1.4,1.3,1.4c0,0,0,0,0.1,0
          h21.2c0.7,0.2,1.5,0.6,1.4,1.5v125.7c0,0.8-0.6,1.4-1.3,1.4c0,0,0,0-0.1,0h-51c-1.8,0-2.8,0.4-2.8-1.4V1.9C0.5,0.2,1.4,0.5,3.3,0.5
          z"/>
        	<rect id="sensor_K0_L0" data-key-type="white" x="2.6" y="305.7" className="sensor" width="24.3" height="60"/>
        	<rect id="sensor_K0_L1" data-key-type="white" x="2.6" y="240.9" className="sensor" width="24.3" height="60"/>
        	<rect id="sensor_K0_L2" data-key-type="white" x="2" y="183" className="sensor" width="13.4" height="53.5"/>
        	<rect id="sensor_K0_L3" data-key-type="white" x="2" y="123.4" className="sensor" width="13.4" height="55"/>
        	<rect id="sensor_K0_L4" data-key-type="white" x="2" y="63.7" className="sensor" width="13.4" height="55"/>
        	<rect id="sensor_K0_L5" data-key-type="white" x="2" y="4.8" className="sensor" width="13.4" height="55"/>
        	<rect id="sensor_K0_R0" data-key-type="white" x="29.1" y="305.7" className="sensor" width="24.3" height="60"/>
        	<rect id="sensor_K0_R1" data-key-type="white" x="29.1" y="240.9" className="sensor" width="24.3" height="60"/>
        	<rect id="sensor_K0_R2" data-key-type="white" x="16.6" y="183" className="sensor" width="13.4" height="53.5"/>
        	<rect id="sensor_K0_R3" data-key-type="white" x="16.6" y="123.4" className="sensor" width="13.4" height="55"/>
        	<rect id="sensor_K0_R4" data-key-type="white" x="16.6" y="63.7" className="sensor" width="13.4" height="55"/>
        	<rect id="sensor_K0_R5" data-key-type="white" x="16.6" y="4.8" className="sensor" width="13.4" height="55"/>
        </g>
      </svg>
    )
  }
}

export default KeyGainKeySensorSVG
