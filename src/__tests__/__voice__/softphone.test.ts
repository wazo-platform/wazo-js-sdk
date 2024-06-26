import { Softphone } from '../../voice/softphone';
import { Actions, States } from '../../state-machine/softphone-state-machine';

import Wazo from '../..';
import InvalidStateTransition from '../../domain/InvalidStateTransition';

const server = 'my.stack.io';
const displayName = 'John Doe';
const webRtcLine = {};
const session = {
  uuid: '1234',
  displayName: jest.fn(() => displayName),
  primaryWebRtcLine: jest.fn(() => webRtcLine),
};

jest.mock('../..', () => ({
  __esModule: true,
  default: {
    Auth: {
      getHost: jest.fn(() => server),
      getSession: jest.fn(() => session),
    },
  },
}));

jest.mock('../../web-rtc-client', () => jest.fn().mockImplementation(() => ({
  register: jest.fn(() => Promise.resolve()),
  unregister: jest.fn(() => Promise.resolve()),
  on: jest.fn(),
  INVITE: 'invite',
})));

const invalidStateTransition = (state: string, action: string) => new InvalidStateTransition(`Invalid state transition from ${state} with action ${action}`, state, action);

describe('Softphone', () => {
  describe('connect', () => {
    it('Should retrieve information from Wazo.Auth', () => {
      const instance = new Softphone();
      // instance.connectWithCredentials = jest.fn();
      jest.spyOn(instance, 'connectWithCredentials');
      instance.connect({});

      expect(Wazo.Auth.getHost).toHaveBeenCalled();
      expect(Wazo.Auth.getSession).toHaveBeenCalled();
      expect(instance.connectWithCredentials).toHaveBeenCalledWith(server, webRtcLine, displayName, { userUuid: session.uuid });
      expect(instance.client.on).toHaveBeenCalledWith('invite', expect.anything());
    });

    it('Should throw an error when already connected', () => {
      const instance = new Softphone();
      instance.softphoneActor.send({ type: Actions.ACTION_REGISTER });

      expect(() => instance.connect({})).toThrowError(invalidStateTransition(States.STATE_REGISTERING, Actions.ACTION_REGISTER));
    });

    it('Should not allow to register twice', () => {
      const instance = new Softphone();
      instance.connect({});

      expect(() => instance.connect({})).toThrowError(invalidStateTransition(States.STATE_REGISTERING, Actions.ACTION_REGISTER));
    });
  });

  describe('disconnect', () => {
    it('Should throw an error when not connected', () => {
      const instance = new Softphone();

      expect(() => instance.disconnect()).toThrowError(invalidStateTransition(States.STATE_UNREGISTERED, Actions.ACTION_UNREGISTER));
    });

    it('Should unregister the client', () => {
      const instance = new Softphone();
      instance.connect({});
      instance.softphoneActor.send({ type: Actions.ACTION_REGISTER_DONE });

      instance.disconnect();

      expect(instance.client.unregister).toHaveBeenCalled();
    });
  });
});
