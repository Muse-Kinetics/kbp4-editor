// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
// import arrowUp from '../../svg/arrow-up.svg'
// import arrowDown from '../../svg/arrow-down.svg'
// import arrowLeft from '../../svg/arrow-left.svg'
// import arrowRight from '../../svg/arrow-right.svg'

const baseButton = {
  color: '#fff',
  backgroundColor: '#4a4a4a',
  borderRadius: 0,
  textTransform: 'uppercase',
  fontSize: '10px',
  lineHeight: '16px',
  textAlign: 'center',
  padding: '2px',
  maxWidth: '100%',
  width: '100%',
  height: '27px',
  cursor: 'pointer',
  borderWidth: '2px',
  borderStyle: 'solid'
}

const baseButtonOver = {
  backgroundColor: '#999',
  textShadow: '0 1px 3px #000',
  outline: 'none'
}

const baseButtonActive = {
  backgroundColor: '#04aef0',
  borderColor: '#4a4a4a'
}

const baseButtonDisabled = {
  cursor: 'not-allowed',
  opacity: '.65',
  boxShadow: 'none'
}

export default {
  rectangleHeader: {
    style: { ...baseButton, borderColor: 'white' },
    activeStyle: { ...baseButtonActive },
    overStyle: { ...baseButtonOver },
    disabledStyle: { ...baseButtonDisabled }
  },
  rectangleBody: {
    style: { ...baseButton, borderColor: '#04aef0' },
    activeStyle: { ...baseButtonActive },
    overStyle: { ...baseButtonOver },
    disabledStyle: { ...baseButtonDisabled }
  },
  round: {
    style: { ...baseButton, width: '45px', height: '45px', borderRadius: '50%' },
    activeStyle: { ...baseButtonActive },
    overStyle: { ...baseButtonOver },
    disabledStyle: { ...baseButtonDisabled }
  },
  square: {
    style: { ...baseButton },
    activeStyle: { ...baseButtonActive },
    overStyle: { ...baseButtonOver },
    disabledStyle: { ...baseButtonDisabled }
  },
  faderVertical: {
    style: { ...baseButton, borderWidth: '1px', borderRadius: '5px', width: '20px', height: '100%' },
    activeStyle: {},
    overStyle: { ...baseButtonOver },
    disabledStyle: { ...baseButtonDisabled }
  },
  arrowUp: {
    style: { ...baseButton, backgroundImage: arrowUp, backgroundRepeat: 'no-repeat', filter: 'drop-shadow(0 0 5px #000)', border: 'none', width: '25px', backgroundColor: 'transparent' },
    activeStyle: { ...baseButtonActive },
    overStyle: { ...baseButtonOver },
    disabledStyle: { ...baseButtonDisabled }
  }
}
