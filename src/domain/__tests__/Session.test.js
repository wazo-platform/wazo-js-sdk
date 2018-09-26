// @flow

import Session from '../Session';

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
        uuid: 'a14dd6d6-547c-434d-bd5c-e882b5b83b54'
      })
    );
  });
});
