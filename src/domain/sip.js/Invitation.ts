import { Invitation as SipJsInvitation } from 'sip.js/lib/api';
import { IncomingInviteRequest } from 'sip.js/lib/core';
import type Session from './Session';

// @ts-ignore
export default class Invitation extends SipJsInvitation implements Session {
  callId: string;

  token: string;

  refreshToken: string;

  uuid: string;

  isCanceled: boolean;

  public incomingInviteRequest: IncomingInviteRequest;

  pendingReinviteAck: number;
}
