// @flow
import newFrom from '../utils/new-from';

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

type LineArguments = {
  id: number,
  extensions: Array<Extension>
};

export default class Line {
  id: number;
  extensions: Array<Extension>;

  static parse(plain: LineResponse): Line {
    return new Line({
      id: plain.id,
      extensions: plain.extensions
    });
  }

  static newFrom(profile: Line) {
    return newFrom(profile, Line);
  }

  is(line: Line) {
    return this.id === line.id;
  }

  constructor({ id, extensions }: LineArguments = {}) {
    this.id = id;
    this.extensions = extensions;
  }
}
