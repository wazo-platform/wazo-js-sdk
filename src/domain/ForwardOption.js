// @flow

import { Record } from 'immutable';

type Response = {
  destination: string,
  enabled: boolean
};

export const FORWARD_KEYS = {
  BUSY: 'busy',
  NO_ANSWER: 'noanswer',
  UNCONDITIONAL: 'unconditional'
};

const ForwardOptionRecord = Record({
  destination: undefined,
  enabled: undefined,
  key: undefined
});

export default class ForwardOption extends ForwardOptionRecord {
  destination: string;
  enabled: boolean;
  key: string;

  static parse(plain: Response, key: string): ForwardOption {
    return new ForwardOption({
      destination: plain.destination || '',
      enabled: plain.enabled,
      key
    });
  }

  setDestination(number: string) {
    return this.set('destination', number);
  }

  is(other: ForwardOption) {
    return this.key === other.key;
  }
}
