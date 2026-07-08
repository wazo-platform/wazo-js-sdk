import type SipLine from '../../domain/SipLine';
import { Phone as PhoneClass } from '../Phone';

jest.mock('../../web-rtc-client', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    close: jest.fn(() => Promise.resolve()),
  })),
  events: [],
  transportEvents: [],
}));

jest.mock('../../domain/Phone/WebRTCPhone', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    hasAnActiveCall: jest.fn(() => false),
    hangup: jest.fn(() => Promise.resolve()),
    close: jest.fn(() => Promise.resolve()),
  })),
  MESSAGE_TYPE_CHAT: 'message/TYPE_CHAT',
  MESSAGE_TYPE_SIGNAL: 'message/TYPE_SIGNAL',
}));

const sipLine = { username: 'user', secret: 'secret' } as SipLine;

describe('simple/Phone', () => {
  describe('connectWithCredentials', () => {
    it('does not create a second client while phone exists', () => {
      const phone = new PhoneClass();
      phone.connectWithCredentials('host:443', sipLine, 'name', {});
      const firstClient = phone.client;

      phone.connectWithCredentials('host:443', sipLine, 'name', {});

      expect(phone.client).toBe(firstClient);
    });

    it('closes the previous client before creating a new one', () => {
      const phone = new PhoneClass();
      phone.connectWithCredentials('host:443', sipLine, 'name', {});
      const oldClient = phone.client;

      // Consumers can force a new connection by resetting `phone` (no public reset API yet)
      phone.phone = null;
      phone.connectWithCredentials('host:443', sipLine, 'name', {});

      expect(oldClient.close).toHaveBeenCalled();
      expect(phone.client).not.toBe(oldClient);
    });
  });

  describe('reset', () => {
    it('closes the phone and clears phone/client so the next connect starts fresh', async () => {
      const phone = new PhoneClass();
      phone.connectWithCredentials('host:443', sipLine, 'name', {});
      const webRtcPhone: any = phone.phone;
      webRtcPhone.close = jest.fn(() => Promise.resolve());

      await phone.reset();

      expect(webRtcPhone.close).toHaveBeenCalled();
      expect(phone.phone).toBeNull();
      expect(phone.client).toBeNull();
    });

    it('closes a dangling client when phone is already null', async () => {
      const phone = new PhoneClass();
      phone.connectWithCredentials('host:443', sipLine, 'name', {});
      const { client } = phone;
      phone.phone = null;

      await phone.reset();

      expect(client.close).toHaveBeenCalled();
      expect(phone.client).toBeNull();
    });

    it('hangs up an active call before closing', async () => {
      const phone = new PhoneClass();
      phone.connectWithCredentials('host:443', sipLine, 'name', {});
      const webRtcPhone: any = phone.phone;
      webRtcPhone.hasAnActiveCall.mockReturnValue(true);

      await phone.reset();

      expect(webRtcPhone.hangup).toHaveBeenCalled();
      expect(webRtcPhone.close).toHaveBeenCalled();
      expect(phone.phone).toBeNull();
    });

    it('still force-closes the client and clears references when phone.close() rejects', async () => {
      const phone = new PhoneClass();
      phone.connectWithCredentials('host:443', sipLine, 'name', {});
      const webRtcPhone: any = phone.phone;
      webRtcPhone.close.mockRejectedValue(new Error('unregister timed out'));
      const { client } = phone;

      await phone.reset();

      expect(client.close).toHaveBeenCalled(); // otherwise the registered UA is orphaned
      expect(phone.phone).toBeNull();
      expect(phone.client).toBeNull();
    });

    it('is a no-op when nothing is connected', async () => {
      const phone = new PhoneClass();

      await expect(phone.reset()).resolves.toBeUndefined();

      expect(phone.phone).toBeNull();
      expect(phone.client).toBeNull();
    });
  });
});
