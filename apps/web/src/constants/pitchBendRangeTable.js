// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
export default {
  0: [ 0, 8192 ],  // - 0 Semi-Tonse
  1: [ 8107, 8277 ],  // - 1/8 Semi-Tone
  2: [ 8021, 8363 ],  // - 1/4 Semi-Tone
  3: [ 7851, 8533 ],  // - 1/2 Semi-Tone
  4: [ 7509, 8875 ],  // - 1 Semi-Tone
  5: [ 6827, 9557 ],  // - 2 Semi-Tone
  6: [ 6144, 10240 ], // - 3 Semi-Tone
  7: [ 5461, 10923 ], // - 4 Semi-Tone
  8: [ 4096, 12288 ], // - 6 Semi-Tone
  9: [ 2731, 13653 ], // - 8 Semi-Tone
  10: [ 1365, 15019 ], // - 10 Semi-Tone
  11: [ 0, 16383 ]    // - 12 Semi-Tone
}

// 8192 = middle / no pitch bend
// +/- from 8192
/*

+/- 0    : [ 8192, 8192 ]     // - 0 Semi-Tonse
+/- 85   : [ 8107, 8277 ]     // - 1/8 Semi-Tone
+/- 171  : [ 8021, 8363 ]     // - 1/4 Semi-Tone
+/- 341  : [ 7851, 8533 ]     // - 1/2 Semi-Tone
+/- 683  : [ 7509, 8875 ]     // - 1 Semi-Tone
+/- 1365 : [ 6827, 9557 ]     // - 2 Semi-Tone
+/- 2048 : [ 6144, 10240 ]    // - 3 Semi-Tone
+/- 2731 : [ 5461, 10923 ]    // - 4 Semi-Tone
+/- 4096 : [ 4096, 12288 ]    // - 6 Semi-Tone
+/- 5461 : [ 2731, 13653 ]    // - 8 Semi-Tone
+/- 6827 : [ 1365, 15019 ]    // - 10 Semi-Tone
+/- 8192 : [ 0, 16383 ]       // - 12 Semi-Tone

*/
