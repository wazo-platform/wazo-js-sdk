import newFrom from '../utils/new-from';

export type AliasResponse = {
  uuid: string;
  type: string;
  backend: string;
  identity: string;
};

export type AliasListResponse = {
  items: Array<AliasResponse>;
  total: number;
};

export default class Alias {
  uuid: string;

  type: string;

  backend: string;

  identity: string;

  static parseMany(plain: AliasListResponse): Array<Alias> {
    if (!plain || !plain.items) {
      return [];
    }

    return plain.items.map(item => Alias.parse(item));
  }

  static parse(plain: AliasResponse): Alias {
    return new Alias({
      uuid: plain.uuid,
      type: plain.type,
      backend: plain.backend,
      identity: plain.identity,
    });
  }

  static newFrom(alias: Alias) {
    return newFrom(alias, Alias);
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
