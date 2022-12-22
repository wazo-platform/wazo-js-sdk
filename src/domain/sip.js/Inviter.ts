import { URI } from 'sip.js';
import { Inviter as SipJsInviter } from 'sip.js/lib/api';
import { SessionState, SignalingState, Body, OutgoingRequestDelegate, RequestOptions, OutgoingNotifyRequest, OutgoingPrackRequest, OutgoingInviteRequest, OutgoingRequestMessage } from 'sip.js/lib/core';
import type Session from './Session';

// @ts-ignore
export default class Inviter extends SipJsInviter implements Session {
  pendingReinviteAck: number;

  localTag: string;

  localURI: URI;

  remoteTag: string;

  remoteTarget: URI;

  remoteURI: URI;

  sessionState: SessionState;

  signalingState: SignalingState;

  answer: Body | undefined;

  offer: Body | undefined;

  notify(delegate?: OutgoingRequestDelegate | undefined, options?: RequestOptions | undefined): OutgoingNotifyRequest {
    // @ts-ignore
    return super.notify(delegate, options);
  }

  prack(delegate?: OutgoingRequestDelegate | undefined, options?: RequestOptions | undefined): OutgoingPrackRequest {
    // @ts-ignore
    return super.prack(delegate, options);
  }

  callId: string;

  token: string;

  refreshToken: string;

  uuid: string;

  isCanceled: boolean;

  outgoingInviteRequest: OutgoingInviteRequest;

  outgoingRequestMessage: OutgoingRequestMessage;
}
