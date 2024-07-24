/* eslint-disable no-underscore-dangle */
import { Inviter, UserAgent, type URI } from 'sip.js';

import softphone from '../../voice/softphone';
import Call from '../../voice/call';
import { Actions, States } from '../../state-machine/call-state-machine';
import { Actions as SoftphoneActions } from '../../state-machine/softphone-state-machine';

import InvalidStateTransition from '../../domain/InvalidStateTransition';

const uaOptions = {
  logBuiltinEnabled: false,
  transportOptions: {
    traceSip: false,
    wsServers: 'ws://localhost',
  },
};

jest.mock('../..', () => ({
  __esModule: true,
  default: {
    Auth: {
      getHost: jest.fn(() => 'my-stack.io'),
      getSession: jest.fn(() => ({
        displayName: () => 'John Doe',
        primaryWebRtcLine: () => ({}),
      })),
    },
  },
}));

jest.mock('../../web-rtc-client', () => jest.fn().mockImplementation(() => ({
  answer: jest.fn(() => Promise.resolve()),
  hangup: jest.fn(() => Promise.resolve()),
  register: jest.fn(() => Promise.resolve()),
  setOnHeartbeatTimeout: jest.fn(() => Promise.resolve()),
  setOnHeartbeatCallback: jest.fn(() => Promise.resolve()),
  on: jest.fn(),
})));

const ua = new UserAgent(uaOptions);
const sipCall = new Inviter(ua, UserAgent.makeURI('sip:1234@my.stack.io') as URI);

softphone.connect();
softphone._sendAction(SoftphoneActions.REGISTER_DONE);

const invalidStateTransition = (state: string, action: string) => new InvalidStateTransition(`Invalid state transition from ${state} with action ${action}`, state, action);

describe('Call', () => {
  describe('accept', () => {
    it('Should throw an error when accepting a not ringing call', async () => {
      const call = new Call(sipCall, softphone);

      await expect(call.accept()).rejects.toThrowError(invalidStateTransition(States.IDLE, Actions.ACCEPT));
    });

    it.only('Should throw an error when the softphone is not registered', async () => {
      const call = new Call(sipCall, softphone);
      call._sendAction(Actions.INCOMING_CALL);
      softphone._sendAction(SoftphoneActions.TRANSPORT_CLOSED);

      await expect(call.accept()).rejects.toThrowError(invalidStateTransition(States.RINGING, Actions.ACCEPT));
    });

    it('Should not throw an error when accepting a not ringing call', async () => {
      const call = new Call(sipCall, softphone);
      call._sendAction(Actions.INCOMING_CALL);

      await call.accept();
      expect(softphone.client.answer).toHaveBeenCalled();
    });
  });

  describe('hangup', () => {
    it('Should throw an error when terminating a non established call', async () => {
      const call = new Call(sipCall, softphone);

      await expect(call.hangup()).rejects.toThrowError(invalidStateTransition(States.IDLE, Actions.HANGUP));
    });

    it('Should not throw an error when terminating an established call', async () => {
      const call = new Call(sipCall, softphone);
      call._sendAction(Actions.MAKE_CALL);
      call._sendAction(Actions.REMOTLY_ACCEPTED);

      await call.hangup();
      expect(softphone.client.hangup).toHaveBeenCalled();
    });
  });
});
