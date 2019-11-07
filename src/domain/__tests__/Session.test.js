// @flow

import Session from '../Session';
import Profile from '../Profile';
import Line from '../Line';

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
          'call-logd.users.me.cdr.read',
        ],
        utc_expires_at: '2017-07-19T21:27:53.086990',
        session_uuid: 'f14dd6d6-547c-434d-bd5c-e882b5b83b32',
        xivo_uuid: '6cd695d2-cdb9-4444-8b2d-27425ab85fa8',
        issued_at: '2017-07-19T16:27:53.086990',
        utc_issued_at: '2017-07-19T20:27:53.086990',
        auth_id: 'a14dd6d6-547c-434d-bd5c-e882b5b83b54',
        metadata: {
          uuid: 'a14dd6d6-547c-434d-bd5c-e882b5b83b54',
        },
        expires_at: '2017-07-19T17:27:53.086990',
        xivo_user_uuid: null,
      },
    };

    const session = Session.parse(plain);

    expect(session).toEqual(
      new Session({
        token: 'b93ae6bd-08d7-4001-9e61-057e72bbc4b3',
        refreshToken: null,
        uuid: 'a14dd6d6-547c-434d-bd5c-e882b5b83b54',
        expiresAt: new Date('2017-07-19T21:27:53.086990z'),
        sessionUuid: 'f14dd6d6-547c-434d-bd5c-e882b5b83b32',
      }),
    );
  });

  describe('about voicemails', () => {
    const A_DATE = new Date(2999, 5, 6, 14, 30, 1);
    it('has access to voicemail given there is a voicemail configured', () => {
      const session = new Session({
        token: 'ref-12345',
        uuid: '1234',
        profile: new Profile({
          voicemail: {
            id: 1234,
            name: 'inbox',
          },
        }),
        expiresAt: A_DATE,
      });

      expect(session.hasAccessToVoicemail()).toBeTruthy();
    });

    describe('When getting all numbers', () => {
      describe('and the user has multiple lines', () => {
        it('should return multiple extensions', () => {
          const session = new Session({
            token: 'ref-12345',
            uuid: '1234',
            profile: new Profile({
              lines: [
                new Line({ id: 9012, extensions: [{ id: 1, exten: '8000', context: 'default' }] }),
                new Line({ id: 3421, extensions: [{ id: 2, exten: '9980', context: 'internal' }] }),
              ],
            }),
            expiresAt: A_DATE,
          });

          expect(session.allNumbers().length).toBeGreaterThan(1);
        });
      });
      describe('and the user has one line', () => {
        it('should return only one extension', () => {
          const session = new Session({
            token: 'ref-12345',
            uuid: '1234',
            profile: new Profile({
              lines: [new Line({ id: 9012, extensions: [{ id: 1, exten: '8000', context: 'default' }] })],
            }),
            expiresAt: A_DATE,
          });

          expect(session.allNumbers().length).toEqual(1);
        });
      });
    });

    it('does not have access to voicemail given there is no voicemail configured', () => {
      const session = new Session({
        token: 'ref-12345',
        uuid: '1234',
        profile: new Profile({
          voicemail: undefined,
        }),
        expiresAt: A_DATE,
      });

      expect(session.hasAccessToVoicemail()).toBeFalsy();
    });

    it('does not have access to voicemail given there is no profile', () => {
      const session = new Session({
        token: 'ref-12345',
        uuid: '1234',
        expiresAt: A_DATE,
      });

      expect(session.hasAccessToVoicemail()).toBeFalsy();
    });
  });

  describe('Session expiration', () => {
    const EXPIRATION_DATE = new Date(2006, 5, 6, 14, 30, 1);

    it('session should be expired given date is equal to expiration date', () => {
      const session = new Session({
        token: 'ref-12345',
        uuid: '1234',
        expiresAt: EXPIRATION_DATE,
      });
      const currentDate = new Date(2006, 5, 6, 14, 30, 1);

      expect(session.hasExpired(currentDate)).toBeTruthy();
    });

    it('session should be expired given date is after expiration', () => {
      const session = new Session({
        token: 'ref-12345',
        uuid: '1234',
        expiresAt: EXPIRATION_DATE,
      });
      const currentDate = new Date(2006, 5, 6, 14, 32, 0);

      expect(session.hasExpired(currentDate)).toBeTruthy();
    });

    it('session should not be expired given date is before expiration', () => {
      const session = new Session({
        token: 'ref-12345',
        uuid: '1234',
        expiresAt: EXPIRATION_DATE,
      });
      const currentDate = new Date(2006, 5, 6, 14, 29, 0);

      expect(session.hasExpired(currentDate)).toBeFalsy();
    });
  });

  describe('when checking if session has a specific extension', () => {
    const session = new Session({
      token: 'ref-12345',
      uuid: '1234',
      profile: new Profile({
        lines: [
          new Line({ id: 9012, extensions: [{ id: 1, exten: '8000', context: 'default' }] }),
          new Line({ id: 3421, extensions: [{ id: 2, exten: '9980', context: 'internal' }] }),
        ],
      }),
      expiresAt: new Date(9999, 0, 1),
    });

    it('should return true given it owns the extension', () => {
      expect(session.hasExtension('8000')).toBeTruthy();
    });

    it("should return true given it owns the extension even if it's not the default one", () => {
      expect(session.hasExtension('9980')).toBeTruthy();
    });

    it("should return false given it does't own the extension", () => {
      expect(session.hasExtension('12')).toBeFalsy();
    });
  });

  describe('when getting the primary context', () => {
    const DEFAULT_CONTEXT = 'default';
    const SOME_CONTEXT = 'some-context';

    let A_SESSION;

    beforeEach(() => {
      A_SESSION = new Session({
        token: 'ref-12345',
        uuid: '1234',
        expiresAt: new Date(9999, 0, 1),
        engineVersion: null,
      });
    });

    describe('given NO engine version', () => {
      beforeEach(() => {
        A_SESSION = new Session({ ...A_SESSION, engineVersion: null });
      });

      describe('and NO profile', () => {
        beforeEach(() => {
          A_SESSION = new Session({ ...A_SESSION, profile: null });
        });

        it('should return default context', async () => {
          const context = A_SESSION.primaryContext();

          expect(context).toEqual(DEFAULT_CONTEXT);
        });
      });

      describe('and NO lines', () => {
        beforeEach(() => {
          A_SESSION = new Session({ ...A_SESSION, profile: new Profile({ lines: [] }) });
        });

        it('should return default context', async () => {
          const context = A_SESSION.primaryContext();

          expect(context).toEqual(DEFAULT_CONTEXT);
        });
      });

      describe('and some lines', () => {
        beforeEach(() => {
          const line = new Line({ extensions: [{ context: SOME_CONTEXT, id: 1, exten: '1' }], id: 1, exten: 1 });
          const profile = new Profile({ lines: [line] });
          A_SESSION = new Session({ ...A_SESSION, profile });
        });

        it('should return line context', async () => {
          const context = A_SESSION.primaryContext();

          expect(context).toEqual(SOME_CONTEXT);
        });
      });
    });

    describe('given an engine version', () => {
      describe('that is invalid', () => {
        beforeEach(() => {
          A_SESSION = new Session({ ...A_SESSION, engineVersion: '19.09' });
        });

        describe('and NO lines', () => {
          beforeEach(() => {
            const profile = new Profile({ lines: [] });
            A_SESSION = new Session({ ...A_SESSION, profile });
          });

          it('should return default context', async () => {
            const context = A_SESSION.primaryContext();

            expect(context).toEqual(DEFAULT_CONTEXT);
          });
        });

        describe('and some lines', () => {
          beforeEach(() => {
            const line = new Line({ extensions: [{ context: SOME_CONTEXT, id: 1, exten: '1' }], id: 1, exten: 1 });
            const profile = new Profile({ lines: [line] });
            A_SESSION = new Session({ ...A_SESSION, profile, engineVersion: '18.08' });
          });

          it('should return line context', async () => {
            const context = A_SESSION.primaryContext();

            expect(context).toEqual(SOME_CONTEXT);
          });
        });
      });

      describe('that is valid', () => {
        describe('and under 19.08', () => {
          describe('and NO lines', () => {
            it('should return default context', async () => {
              const context = A_SESSION.primaryContext();

              expect(context).toEqual(DEFAULT_CONTEXT);
            });
          });

          describe('and some lines', () => {
            beforeEach(() => {
              const line = new Line({ extensions: [{ context: SOME_CONTEXT, id: 1, exten: '1' }], id: 1, exten: 1 });
              const profile = new Profile({ lines: [line] });
              A_SESSION = new Session({ ...A_SESSION, profile });
            });

            it('should return line context', async () => {
              const context = A_SESSION.primaryContext();

              expect(context).toEqual(SOME_CONTEXT);
            });
          });
        });

        describe('and equal to 19.08', () => {
          it('should return default context', async () => {
            const context = A_SESSION.primaryContext();

            expect(context).toEqual(DEFAULT_CONTEXT);
          });
        });

        describe('and higher then 19.08', () => {
          it('should return default context', async () => {
            const context = A_SESSION.primaryContext();

            expect(context).toEqual(DEFAULT_CONTEXT);
          });
        });
      });

      describe('when version is 19.10', () => {
        it('should not consider that version is 19.1', () => {
          A_SESSION = new Session({ ...A_SESSION, engineVersion: '19.10' });
          expect(A_SESSION.hasEngineVersionGte('19.10')).toBeTruthy();
          expect(A_SESSION.hasEngineVersionGte('19.11')).toBeFalsy();
          expect(A_SESSION.hasEngineVersionGte('19.09')).toBeTruthy();
          expect(A_SESSION.hasEngineVersionGte('19.1')).toBeTruthy();
          expect(A_SESSION.hasEngineVersionGte('19.2')).toBeTruthy();
        });
      });
    });
  });
});
