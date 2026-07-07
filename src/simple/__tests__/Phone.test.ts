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
});
