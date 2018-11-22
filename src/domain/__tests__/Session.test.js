// @flow

import Session from '../Session';
import Profile from '../Profile';

describe('Session domain', () => {
  it('can parse a plain session to domain', () => {
    const plain = {
      data: {
        token: 'b93ae6bd-08d7-4001-9e61-057e72bbc4b3',
        acls: [
          'confd.infos.read',
          'confd.users.me.read',
          'confd.users.me.update',
          'confd.users.me.funckeys.*',
          'confd.users.me.funckeys.*.*',
          'confd.users.me.#.read',
          'confd.users.me.services.*.*',
          'confd.users.me.forwards.*.*',
          'ctid-ng.users.me.#',
          'ctid-ng.users.*.presences.read',
          'ctid-ng.lines.*.presences.read',
          'ctid-ng.switchboards.#',
          'ctid-ng.transfers.*.read',
          'ctid-ng.transfers.*.delete',
          'ctid-ng.transfers.*.complete.update',
          'dird.#.me.read',
          'dird.directories.favorites.#',
          'dird.directories.lookup.*.headers.read',
          'dird.directories.lookup.*.read',
          'dird.directories.personal.*.read',
          'dird.personal.#',
          'events.calls.me',
          'events.chat.message.*.me',
          'events.config.users.me.#',
          'events.statuses.*',
          'events.switchboards.#',
          'events.transfers.me',
          'events.users.me.#',
          'events.directory.me.#',
          'websocketd',
          'call-logd.users.me.cdr.read'
        ],
        metadata: null,
        utc_expires_at: '2017-07-19T21:27:53.086990',
        xivo_uuid: '6cd695d2-cdb9-4444-8b2d-27425ab85fa8',
        issued_at: '2017-07-19T16:27:53.086990',
        utc_issued_at: '2017-07-19T20:27:53.086990',
        auth_id: 'a14dd6d6-547c-434d-bd5c-e882b5b83b54',
        expires_at: '2017-07-19T17:27:53.086990',
        xivo_user_uuid: 'a14dd6d6-547c-434d-bd5c-e882b5b83b54'
      }
    };

    const session = Session.parse(plain);

    expect(session).toEqual(
      new Session({
        token: 'b93ae6bd-08d7-4001-9e61-057e72bbc4b3',
        uuid: 'a14dd6d6-547c-434d-bd5c-e882b5b83b54',
        utcExpiresAt: '2017-07-19T21:27:53.086990',
      })
    );
  });

  describe('about voicemails', () => {
    it('has access to voicemail given there is a voicemail configured', () => {
      const session = new Session({
        token: 'ref-12345',
        uuid: '1234',
        profile: new Profile({
          voicemail: {
            id: 1234,
            name: 'inbox'
          }
        }),
        utcExpiresAt: '2999-07-19T21:27:53.086990'
      });

      expect(session.hasAccessToVoicemail()).toBeTruthy();
    });

    it('does not have access to voicemail given there is no voicemail configured', () => {
      const session = new Session({
        token: 'ref-12345',
        uuid: '1234',
        profile: new Profile({
          voicemail: undefined
        }),
        utcExpiresAt: '2999-07-19T21:27:53.086990'
      });

      expect(session.hasAccessToVoicemail()).toBeFalsy();
    });

    it('does not have access to voicemail given there is no profile', () => {
      const session = new Session({ 
        token: 'ref-12345',
        uuid: '1234',
        utcExpiresAt: '2999-07-19T21:27:53.086990'
      });

      expect(session.hasAccessToVoicemail()).toBeFalsy();
    });
  });

  describe('Session expiration', () => {
    const EXPIRATION_DATE = '2006-06-06T14:30:01.000000';
    
    it('session should be expired given date is equal to expiration date', () => {
      const session = new Session({
        token: 'ref-12345',
        uuid: '1234',
        utcExpiresAt: EXPIRATION_DATE
      });
      const currentDate = new Date(2006,5,6,14,30,1);

      expect(session.hasExpired(currentDate)).toBeTruthy();
    })

    it('session should be expired given date is after expiration', () => {
      const session = new Session({
        token: 'ref-12345',
        uuid: '1234',
        utcExpiresAt: EXPIRATION_DATE
      });
      const currentDate = new Date(2006,5,6,14,32,0);

      expect(session.hasExpired(currentDate)).toBeTruthy();
    })

    it('session should not be expired given date is before expiration', () => {
      const session = new Session({
        token: 'ref-12345',
        uuid: '1234',
        utcExpiresAt: EXPIRATION_DATE
      });
      const currentDate = new Date(2006,5,6,14,29,0);

      expect(session.hasExpired(currentDate)).toBeFalsy();
    });
  });
});
