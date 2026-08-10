// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
export const  PID = 37 // KBOARD_PRO4_PID

export const  SYSEX_START = 0xF0
export const  SYSEX_END = 0xF7

export const  SYX_LENGTH_LOCATION = 7
export const  SYX_MESSAGE_START_LOCATION = SYX_LENGTH_LOCATION + 1
export const  SYX_MESSAGE_START_LOCATION_TABLE = SYX_LENGTH_LOCATION
export const  LENGTH_OF_SYX_PRESET_MSG_BOILERPLATE = 9

export const  SYX_FIRMWARE_PACKET          = 0x00
export const  SYX_EDITOR_MESSAGE           = 0x01
export const  SYX_SET_USER_TABLE_MESSAGE   = 0x02

export const  SYX_EDIT_SENSOR_CALIBRATION  = 1
export const  SYX_PRESET_MSG_KEY_AXIS      = 2
export const  SYX_PRESET_MSG_PEDAL         = 3
export const  SYX_PRESET_MSG_SLIDER        = 4
export const  SYX_PRESET_MSG_NAME_STRING   = 5
export const  SYX_PRESET_MSG_PITCH_BEND    = 6
export const  SYX_PRESET_ZONE_GLOBALS      = 7
export const  SYX_PRESET_GLOBALS           = 8
export const  SYX_PRESET_START             = 9
export const  SYX_PRESET_END               = 10
export const  SYX_PRESET_REQUEST           = 11
export const  SYX_SAVE_CALIBRATION_VALUES  = 12
export const  SYX_LOAD_CALIBRATION_VALUES  = 13
export const  SYX_SAVE_PRESET_TO_ROM	     = 14
export const  SYX_LOAD_PRESET_FROM_ROM     = 15
export const  SYX_FIRMWARE_VERSION_MSG     = 16
export const  SYX_ERASE_ALL_PRESETS        = 17
export const  SYX_PERIPHERAL_PRESENT       = 18
export const  SYX_ERASE_USER_TABLES        = 19
export const  SYX_GET_USER_TABLE           = 20
export const  SYX_RESERVED_0               = 21
export const  SYX_RESERVED_1               = 22
export const  SYX_UI_SYNC_MESSAGE          = 23
export const  SYX_MIN_PRESSURE             = 24
export const  SYX_MAX_PRESSURE             = 25
export const  SYX_RESERVED_FOR_ZACH_2      = 26
export const  SYX_CC_REPLACEMENT           = 27
export const  SYX_CAL_MEM_ERASE            = 28
export const  SYX_LOAD_GANG2_MIN_MAX       = 29
export const  SYX_SAVE_GANG2_MIN_MAX       = 30
export const  SYX_DUMP_GANG2_MIN_RAM       = 31
export const  SYX_DUMP_GANG2_MIN_ROM       = 32
export const  SYX_DUMP_GANG2_MAX_RAM       = 33
export const  SYX_DUMP_GANG2_MAX_ROM       = 34
export const  SYX_DUMP_GANG_NONE_CAPTURE   = 35
export const  SYX_DUMP_GANG_12_CAPTURE     = 36
export const  SYX_SAVE_ADC_CAPTURE_TO_MIN  = 37
export const  SYX_SAVE_ADC_CAPTURE_TO_MAX  = 38
export const  SYX_NO_GANG_MIN_EDIT         = 39
export const  SYX_NO_GANG_MAX_EDIT         = 40
export const  SYX_12_GANG_MIN_EDIT         = 41
export const  SYX_12_GANG_MAX_EDIT         = 42
export const  SYX_DUMP_GANG0_MIN_RAM       = 43
export const  SYX_DUMP_GANG0_MIN_ROM       = 44
export const  SYX_DUMP_GANG0_MAX_RAM       = 45
export const  SYX_DUMP_GANG0_MAX_ROM       = 46
export const  SYX_DUMP_GANG12_MIN_RAM      = 47
export const  SYX_DUMP_GANG12_MIN_ROM      = 48
export const  SYX_DUMP_GANG12_MAX_RAM      = 49
export const  SYX_DUMP_GANG12_MAX_ROM      = 50
export const  SYX_WRITE_MEM_LOCATION	     = 51
export const  SYX_REQ_MEM_LOCATION         = 52
export const  SYX_ERASE_MEM_BANK           = 53
export const  SYX_SEND_MEM_LOCATION        = 54
export const  SYX_SEND_SOLO_MESSAGE        = 55
export const  SYX_RECALC_CALIBRATION_VALS  = 56
export const  SYX_DUMP_ADJSTD_GANG_0_MAX   = 57
export const  SYX_PRESET_REQUEST_V1_2      = 58
export const  SYX_PRESET_GLOBALS_V1_2      = 59
export const  SYX_PRESET_MSG_KEY_AXIS_V1_2 = 60
export const  SYX_PRESET_MSG_PITCH_BEND_V1_2 = 61
export const  SYX_PRESET_ZONE_GLOBALS_V1_2 = 62

export const  SYX_UI_SYNC_ACTIVE_PRESET            = 0
export const  SYX_UI_SYNC_ZONE_MEMBER_BEND_RANGE   = 1
export const  SYX_UI_SYNC_ZONE_OCTAVE              = 2
export const  SYX_UI_SYNC_ZONE_TRANSPOSE           = 3
export const  SYX_UI_SYNC_ZONE_RETURN_MODE         = 4
export const  SYX_UI_SYNC_ZONE_RETURN_TIME         = 5
export const  SYX_UI_SYNC_SLIDER_MODE_CHANGE       = 6

export const  AX_X = 0
export const  AX_Y = 1
export const  AX_Z = 2

export const  LOWER_ZONE = 0
export const  UPPER_ZONE = 1

export const  NUM_ZONES = 2
export const  NUM_AXES = 3
export const  NUM_SLIDERS = 4
export const  NUM_PEDALS = 2

export const  MAX_NAME_STRING_LENGTH = 32
export const  MAX_NAME_STRING_LENGTH_PLUS_NUL = 33
export const  NUL = "\0"
export const  NUL_BYTE = 0
export const  IGNORE_VERSION_BYTES = 0x7F

export const  RAM_PRESET       = 0
export const  PRESET_SLOT_0    = 1
export const  PRESET_SLOT_1    = 2
export const  PRESET_SLOT_2    = 3
export const  PRESET_SLOT_3    = 4
export const  DEFAULT_PRESET   = 5

export const SYX_MESSAGE_START = [SYSEX_START, 0x00, 0x01, 0x5F, 0x7A, PID, SYX_EDITOR_MESSAGE]
export const SYX_MESSAGE_START_TABLE = [SYSEX_START, 0x00, 0x01, 0x5F, 0x7A, PID, SYX_SET_USER_TABLE_MESSAGE]

// Per Key Per Sensor Gain
export const GANG2_MIN_PAGE = 0
export const GANG2_MAX_PAGE = 1

export const MEM_LOC_AUDITION          = 0
export const MEM_LOC_WRITE             = 1
export const MEM_LOC_TETHER_FROM_RAM   = 2
export const MEM_LOC_TETHER_FROM_ROM   = 3

export const USER_MEM_BANK_0 = 0
export const USER_MEM_BANK_1 = 1
export const USER_MEM_BANK_2 = 2

export const USER_MEM_BANK_GANG_2  = 0
export const USER_MEM_BANK_GANG_12 = 1
export const USER_MEM_BANK_GANG_0  = 2

// solo messaging
export const MIDI_NOTE_OFF			    = 0x80
export const MIDI_NOTE_ON			      = 0x90
export const MIDI_NOTE_AFTERTOUCH	  = 0xA0
export const MIDI_CONTROL_CHANGE		= 0xB0
export const MIDI_PROG_CHANGE		    = 0xC0
export const MIDI_CHANNEL_PRESSURE	= 0xD0
export const MIDI_PITCH_BEND			  = 0xE0
