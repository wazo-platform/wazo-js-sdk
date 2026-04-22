import newFrom from '../utils/new-from';

export type UserIdentityResponse = {
  uuid: string;
  type: string;
  backend: string;
  identity: string;
};

export type UserIdentityListResponse = {
  items: Array<UserIdentityResponse>;
  total: number;
};

export default class UserIdentity {
  uuid: string;

  type: string;

  backend: string;

  identity: string;

  static parseMany(plain: UserIdentityListResponse): Array<UserIdentity> {
    if (!plain?.items) {
      return [];
    }

    return plain.items.map(item => UserIdentity.parse(item));
  }

  static parse(plain: UserIdentityResponse): UserIdentity {
    return new UserIdentity({
      uuid: plain.uuid,
      type: plain.type,
      backend: plain.backend,
      identity: plain.identity,
    });
  }

  static newFrom(userIdentity: UserIdentity) {
    return newFrom(userIdentity, UserIdentity);
  }

  constructor({
    uuid,
    type,
    backend,
    identity,
  }: Record<string, any> = {}) {
    this.uuid = uuid;
    this.type = type;
    this.backend = backend;
    this.identity = identity;
  }

}
