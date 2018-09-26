// @flow
/* eslint-disable */

import type { Device } from './Device';

export default class DebugDevice implements Device {
  connectToCall() {
    console.info('DebugDevice - Connected to call');
  }

  disconnectFromCall() {
    console.info('DebugDevice - Disconnected from call');
  }

  ringback() {
    console.info('DebugDevice - Ringback');
  }

  stopRingback() {
    console.info('DebugDevice - Stop ringback');
  }

  playRingtone() {
    console.info('DebugDevice - Play ringtone');
  }

  stopRingtone() {
    console.info('DebugDevice - Stop ringtone');
  }

  mute() {
    console.info('DebugDevice - Mute');
  }

  unmute() {
    console.info('DebugDevice - Unmute');
  }

  putOnSpeaker() {
    console.info('DebugDevice - Put on speaker');
  }

  putOffSpeaker() {
    console.info('DebugDevice - Put off speaker');
  }
}
