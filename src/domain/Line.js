// @flow

import { Record } from 'immutable';

type Extension = {
  context: string,
  exten: string,
  id: number,
  links?: Array<{ href: string, rel: string }>
};

type LineResponse = {
  endpoint_custom: ?string,
  endpoint_sccp: ?string,
  extensions: Array<Extension>,
  id: number
};

const LineRecord = Record({
  id: undefined,
  extensions: []
});

export default class Line extends LineRecord {
  id: number;
  extensions: Array<Extension>;

  static parse(plain: LineResponse): Line {
    return new Line({
      id: plain.id,
      extensions: plain.extensions
    });
  }
}
