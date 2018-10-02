// @flow

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

  constructor({ id, extensions }: LineArguments) {
    this.id = id;
    this.extensions = extensions;
  }
}
