# K-Board Pro 4 JS API (V2):

### Device
`reset()`   
    resets [presets, userCurves, globals] to factory settings, device return void

`getFirmwareVersion()`    
    requests firmware/bootloader version
    device return "1.0.0.0.1.0.0" (4-digit firmware, 3-digit bootloader)

`enterBootloader()`   
    puts the device into bootloader mode
    device return void


### Presets
`loadPreset(presetIndex)`   
    loads flash preset into edit buffer
    device return void

`savePreset(memoryIndex)`   
    saves edit buffer to flash [1-4]
    device return void

`sendPreset(presetObject)`  
    sends editor preset to edit-buffer
    device return void

`getPreset(presetIndex)`  
    requests device preset
    device return preset_start_index, preset_params, preset_end_index

`getUserCurve(curveIndex)`    
    requests user defined curve / velocity table
    device return

`getParam(paramName)`   
    // not sure if this will be used but might be useful to have requests preset param by name
    device return param values for both zones

`setParam(paramName, paramValues)`  
    sends grouped param to device
    device return void

`setUserCurve([127 value array])`   
    sends device user curve
    device return void

`load` --> load from flash into edit buffer   
`send` --> send from editor to edit buffer  
`save` --> save from edit buffer to flash   
