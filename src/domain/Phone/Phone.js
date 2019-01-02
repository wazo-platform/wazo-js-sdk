// @flow

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
  onCallFailed?: (message: string) => {}
};

export interface Phone {
  makeCall(number: string): void;

  acceptCall(): void;

  mute(): void;

  unmute(): void;

  hold(): void;

  unhold(): void;

  transfer(target: string): void;

  sendKey(key: string): void;

  putOnSpeaker(): void;

  putOffSpeaker(): void;

  endCall(): void;

  isInCall(): boolean;

  onConnectionMade(): void;

  close(): void;
}
