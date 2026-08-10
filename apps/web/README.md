#K-Board Pro 4 Editor

###BUILD:
  * nvm use 14: confirmed on Andrej's windows laptop
  * update submodules
  * npm i - do this on the main directory, and again in src/lib/k-board-pro-4-js-api

###TODO:
  * visualizer: should be functional with a variety of axis modes
  * notify user if new editor is available

  * number input: drag to change

###ISSUES:
  * when saving on-device --> on-device, handle duplicate names
    use selected destination 1..4 and get its corresponding name in presets.device
    if currentPreset.name === destinatonPreset.name; version name (.[1-9]), send to device, savePreset
    this should also work for already incremented presets: check if version number, increment +1

###Easter Eggs:
  * 23 skidoo splitKey triangle