// @flow
/* eslint-disable */

import type { Phone, PhoneEventCallbacks } from './Phone';
import CallSession from '../CallSession';

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

  isCallUsingVideo(callSession: CallSession): boolean {
    return false;
  }

  isOnline(): boolean {
    return true;
  }

  isWebRTC(): boolean {
    return false;
  }

  removeListener(listener: $Shape<PhoneEventCallbacks>): void {
    console.info('DebugPhone - removeListener');
  }

  endCurrentCall(CallSession: CallSession): void {
    console.info('DebugPhone - removeListener');
  }

  getLocalStreamForCall(callSession: CallSession): boolean {
    return false;
  }

  getRemoteStreamForCall(callSession: CallSession): boolean {
    return false;
  }

  disableRinging(): void {
    console.info('DebugPhone - disableRinging');
  }

  enableRinging(): void {
    console.info('DebugPhone - enableRinging');
  }

  hasAnActiveCall(): boolean {
    return false;
  }

  reject(callSession: CallSession): void {
    console.info('DebugPhone - reject');
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

  isInCall(): boolean {
    return false;
  }

  onConnectionMade() {
    console.info('DebugPhone - Connection made');
  }

  close() {
    console.info('DebugPhone - Close');
  }

  changeAudioDevice(id: string): void {
    console.info(`DebugPhone - changeAudioDevice: ${id}`);
  }

  changeAudioInputDevice(id: string): void {
    console.info(`DebugPhone - changeAudioInputDevice: ${id}`);
  }

  changeVideoInputDevice(id: string): void {
    console.info(`DebugPhone - changeVideoInputDevice: ${id}`);
  }

  addToConference(participants: CallSession[]): void {
    console.info(`DebugPhone - addToConference: ${participants.join(', ')}`);
  }

  startConference(participants: CallSession[]): void {
    console.info(`DebugPhone - startConference: ${participants.join(', ')}`);
  }

  resumeConference(participants: CallSession[]): void {
    console.info(`DebugPhone - resumeConference: ${participants.join(', ')}`);
  }

  holdConference(participants: CallSession[]): void {
    console.info(`DebugPhone - holdConference: ${participants.join(', ')}`);
  }

  unmuteConference(participants: CallSession[]): void {
    console.info(`DebugPhone - unmuteConference: ${participants.join(', ')}`);
  }

  muteConference(participants: CallSession[]): void {
    console.info(`DebugPhone - muteConference: ${participants.join(', ')}`);
  }

  hangupConference(participants: CallSession[]): void {
    console.info(`DebugPhone - hangupConference: ${participants.join(', ')}`);
  }

  removeFromConference(participants: CallSession[]): void {
    console.info(`DebugPhone - removeFromConference: ${participants.join(', ')}`);
  }

  transfer(callSession: CallSession, target: string): void {
    console.info(`DebugPhone - transfer ${target}`);
  }

  indirectTransfer(source: CallSession, destination: CallSession): void {
    console.info(`DebugPhone - indirectTransfer ${destination.number}`);
  }

  turnCameraOff(callSession: CallSession): void {
    console.info(`DebugPhone - turnCameraOff ${callSession.number}`);
  }

  turnCameraOn(callSession: CallSession): void {
    console.info(`DebugPhone - turnCameraOn ${callSession.number}`);
  }
}
