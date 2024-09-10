/* eslint-disable no-underscore-dangle */
import { Inviter, UserAgent, type URI } from 'sip.js';

import softphone from '../../voice/softphone';
import Call from '../../voice/call';
import { Actions, EstablishedStates, EstablishedSubStates, States } from '../../state-machine/call-state-machine';
import { Actions as SoftphoneActions } from '../../state-machine/softphone-state-machine';
import ApiCall from '../../domain/Call';

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
  mute: jest.fn(() => Promise.resolve()),
  hold: jest.fn(() => Promise.resolve()),
  unhold: jest.fn(() => Promise.resolve()),
  hangup: jest.fn(() => Promise.resolve()),
  register: jest.fn(() => Promise.resolve()),
  onCallEnded: jest.fn(() => Promise.resolve()),
  setOnHeartbeatTimeout: jest.fn(() => Promise.resolve()),
  setOnHeartbeatCallback: jest.fn(() => Promise.resolve()),
  on: jest.fn(),
})));

const ua = new UserAgent(uaOptions);
const sipCall = new Inviter(ua, UserAgent.makeURI('sip:1234@my.stack.io') as URI);

softphone.connect();
// @ts-ignore: private method
softphone._sendAction(SoftphoneActions.REGISTER_DONE);

const invalidStateTransition = (state: string, action: string) => new InvalidStateTransition(`Invalid state transition from ${state} with action ${action}`, state, action);

describe('Call', () => {
  describe('parsing an API call', () => {
    it('Should parse an API call and transform it to a Call instance', async () => {
      const apiCall = new ApiCall({
        id: '1234',
        sipCallId: 'abcd',
        isCaller: false,
        isVideo: true,
        recording: true,
        callerName: '',
        callerNumber: '',
        calleeName: '',
        calleeNumber: '0123423223',
        dialedExtension: '',
        lineId: null,
        muted: true,
        onHold: false,
        startingTime: new Date(),
        status: 'Up',
        talkingToIds: [],
      });
      const call = Call.parseCall(apiCall);

      expect(call.recording).toBeTruthy();
      expect(call.id).toBe(apiCall.sipCallId);
      expect(call.apiId).toBe(apiCall.id);
      expect(call.number).toBe(apiCall.calleeNumber);
      expect(call.answerTime).toStrictEqual(undefined);
      expect(call.creationTime).toStrictEqual(apiCall.startingTime);
      expect(call.isMuted()).toBeTruthy();
      expect(call.state).toStrictEqual({
        [States.ESTABLISHED]: {
          [EstablishedStates.ONGOING]: {},
          [EstablishedSubStates.MUTE]: EstablishedStates.MUTED,
          [EstablishedSubStates.HOLD]: EstablishedStates.UN_HELD,
        },
      });
      expect(call.isEstablished()).toBeTruthy();
    });
  });

  describe('accept', () => {
    it('Should throw an error when accepting a not ringing call', async () => {
      const call = new Call(sipCall, softphone);

      await expect(call.accept()).rejects.toThrowError(invalidStateTransition(States.IDLE, Actions.ACCEPT));
    });

    it('Should throw an error when the softphone is not registered', async () => {
      const call = new Call(sipCall, softphone);
      // @ts-ignore: private method
      call._sendAction(Actions.INCOMING_CALL);
      // @ts-ignore: private method
      softphone._sendAction(SoftphoneActions.TRANSPORT_CLOSED);

      await expect(call.accept()).rejects.toThrowError(invalidStateTransition(States.RINGING, Actions.ACCEPT));

      // Revert softphone state
      softphone.connect();
      // @ts-ignore: private method
      softphone._sendAction(SoftphoneActions.REGISTER_DONE);
    });

    it('Should not throw an error when accepting a not ringing call', async () => {
      const call = new Call(sipCall, softphone);
      // @ts-ignore: private method
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
      // @ts-ignore: private method
      call._sendAction(Actions.MAKE_CALL);
      // @ts-ignore: private method
      call._sendAction(Actions.REMOTLY_ACCEPTED);

      await call.hangup();
      expect(softphone.client.hangup).toHaveBeenCalled();
    });
  });

  describe('state propagation', () => {
    it('Should update the call state in events', (done) => {
      const call = new Call(sipCall, softphone);
      // @ts-ignore: private method
      call._sendAction(Actions.MAKE_CALL);

      call.on('remotelyAccepted', () => {
        expect(call.state).toStrictEqual({
          [States.ESTABLISHED]: {
            [EstablishedStates.ONGOING]: {},
            [EstablishedSubStates.MUTE]: EstablishedStates.UN_MUTED,
            [EstablishedSubStates.HOLD]: EstablishedStates.UN_HELD,
          },
        });
        done();
      });

      call.onAccepted();
    });
  });

  describe('Multiple sub state', () => {
    it('Should mute and hold a call', () => {
      const call = new Call(sipCall, softphone);
      // @ts-ignore: private method
      call._sendAction(Actions.MAKE_CALL);

      expect(call.isMuted()).toBeFalsy();
      expect(call.isHeld()).toBeFalsy();

      // @ts-ignore: private method
      call._sendAction(Actions.REMOTLY_ACCEPTED);

      call.mute();
      expect(call.isMuted()).toBeTruthy();
      expect(call.isHeld()).toBeFalsy();

      call.hold();
      expect(call.isMuted()).toBeTruthy();
      expect(call.isHeld()).toBeTruthy();

      call.resume();
      expect(call.isMuted()).toBeTruthy();
      expect(call.isHeld()).toBeFalsy();
    });
  });
});
