// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
import React, { Component } from 'react';
import { connect } from 'react-redux'
import classnames from 'classnames'

import './KBoardPro4Keys.css'

import keyPathsScaled from '../constants/keyPathsScaled'
import stemPaths from '../constants/stemPaths'

import SplitSlider from './UI/SplitSlider'

import ZoneCover from './ZoneCover'

import tooltips from '../constants/tooltips.json'

// animate with https://svgjs.com / https://konvajs.github.io instead of canvas?

class KBoardPro4Keys extends Component {

	render() {
		const {
			splitKey,
			showTooltips
		} = this.props

		return (
			<div
				className='k-board-pro-4-keys'
				data-tip={tooltips['editor-keyboard']}
				data-multiline="true"
				data-place="right"
				data-tip-disable={!showTooltips}
			>
				<canvas></canvas>
  			<svg id="KBoardPro4Stems" viewBox="0 0 974.03 129.2">
  				{stemPaths.map((stem, index) => {
  					return <path
  						data-stem={index}
  						key={index}
							data-type={stem.type}
  						className={
								classnames(
									'stem'
								)}
  						data-note={stem.note}
  						d={stem.d}>
						</path>
  				})}
  			</svg>
  			<svg id="KBoardPro4Keys" viewBox="0 0 974.03 206.67">
  				{keyPathsScaled.map((key, index) => {
  					return <path
  						id={`key${key.id}`}
  						data-key={index}
  						key={index}
							data-type={key.type}
  						className={
								classnames(
									'key',
									{'split': (splitKey > 0 && splitKey < 48) && splitKey === ~~key.id}
								)}
  						data-note={key.note}
  						d={key.d}>
						</path>
  				})}
  			</svg>
				<ZoneCover />
				<SplitSlider name="split" label="A" />
			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
		keyGainModeOpen: state.editor.keyGainModeOpen,
		splitKey: state.currentPreset.zone_split_key_num,
		showTooltips: state.editorPreferences.showTooltips
  }
}

export default connect(mapStateToProps, null)(KBoardPro4Keys)
