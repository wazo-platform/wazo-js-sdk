import { SessionDescriptionHandler } from 'sip.js';
import type { Session as SipJsSession } from 'sip.js/lib/core/session';

export default interface Session extends SipJsSession {
  callId: string
  sessionDescriptionHandler: SessionDescriptionHandler
  pendingReinviteAck: number;
}
