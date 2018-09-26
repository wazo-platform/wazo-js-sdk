// @flow
/* eslint-disable */

import type { Phone } from './Phone';

export default class DebugPhone implements Phone {
  makeCall(number: string) {
    console.info('DebugPhone - calling: ${number}');
  }

  acceptCall() {
    console.info('DebugPhone - Accept call');
  }

  mute() {
    console.info('DebugPhone - Mute phone');
  }

  unmute() {
    console.info('DebugPhone - Unmute phone');
  }

  hold() {
    console.info('DebugPhone - Put on hold');
  }

  unhold() {
    console.info('DebugPhone - Put on unhold');
  }

  transfer(target: string) {
    console.info(`DebugPhone - Transferring to ${target}`);
  }

  sendKey(key: string) {
    console.info('DebugPhone - sending: ${key}');
  }

  putOnSpeaker() {
    console.info('DebugPhone - Put on speaker');
  }

  putOffSpeaker() {
    console.info('DebugPhone - Put off speaker');
  }

  endCall() {
    console.info('DebugPhone - Hang up');
  }

  onConnectionMade() {
    console.info('DebugPhone - Connection made');
  }

  close() {
    console.info('DebugPhone - Close');
  }
}
