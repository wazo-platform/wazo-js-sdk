// @flow

import CallSession from '../CallSession';

export type PhoneEventCallbacks = {
  onCallIncoming?: (number: string) => {},
  onCallOutgoing?: (number: string) => {},
  onCallRinging?: () => void,
  onCallAccepted?: () => void,
  onCallHeld?: () => void,
  onCallResumed?: () => void,
  onCallMuted?: () => void,
  onCallUnmuted?: () => void,
  onCallEnded?: () => {},
  onCallFailed?: (message: string) => {},
};

export interface Phone {
  makeCall(number: string): void;

  acceptCall(): void;

  mute(): void;

  unmute(): void;

  hold(): void;

  unhold(): void;

  isCallUsingVideo(callSession: CallSession): boolean;

  isOnline(): boolean;

  isWebRTC(): boolean;

  removeListener(listener: $Shape<PhoneEventCallbacks>): void;

  endCurrentCall(CallSession: CallSession): void;

  getLocalStreamForCall(callSession: CallSession): boolean;

  getRemoteStreamForCall(callSession: CallSession): boolean;

  disableRinging(): void;

  enableRinging(): void;

  hasAnActiveCall(): boolean;

  sendKey(key: string): void;

  putOnSpeaker(): void;

  putOffSpeaker(): void;

  endCall(): void;

  isInCall(): boolean;

  onConnectionMade(): void;

  reject(callSession: CallSession): void;

  close(): void;

  changeAudioDevice(id: string): void;

  changeAudioInputDevice(id: string): void;

  changeVideoInputDevice(id: string): void;

  addToConference(participants: CallSession[]): void;

  startConference(participants: CallSession[]): void;

  resumeConference(participants: CallSession[]): void;

  holdConference(participants: CallSession[]): void;

  unmuteConference(participants: CallSession[]): void;

  muteConference(participants: CallSession[]): void;

  hangupConference(participants: CallSession[]): void;

  removeFromConference(participants: CallSession[]): void;

  transfer(callSession: CallSession, target: string): void;

  indirectTransfer(source: CallSession, destination: CallSession): void;

  turnCameraOff(callSession: CallSession): void;

  turnCameraOn(callSession: CallSession): void;
}
