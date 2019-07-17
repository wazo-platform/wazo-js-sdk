// @flow
import newFrom from '../utils/new-from';

type Extension = {
  context: string,
  exten: string,
  id: number,
  links?: Array<{ href: string, rel: string }>,
};

export type Endpoint = {
  id: number,
  links: Array<{ href: string, rel: string }>,
  username?: string,
};

type LineResponse = {
  endpoint_custom: ?Endpoint,
  endpoint_sccp: ?Endpoint,
  endpoint_sip: ?Endpoint,
  extensions: Array<Extension>,
  id: number,
};

type LineArguments = {
  id: number,
  extensions: Array<Extension>,
  endpointCustom?: Endpoint | null,
  endpointSccp?: Endpoint | null,
  endpointSip?: Endpoint | null,
};

export default class Line {
  type: string;

  id: number;
  extensions: Array<Extension>;
  endpointCustom: Endpoint | null;
  endpointSccp: Endpoint | null;
  endpointSip: Endpoint | null;

  static parse(plain: LineResponse): Line {
    return new Line({
      id: plain.id,
      extensions: plain.extensions,
      endpointCustom: plain.endpoint_custom || null,
      endpointSccp: plain.endpoint_sccp || null,
      endpointSip: plain.endpoint_sip || null,
    });
  }

  static newFrom(profile: Line) {
    return newFrom(profile, Line);
  }

  is(line: Line) {
    return this.id === line.id;
  }

  hasExtension(extension: string) {
    return this.extensions.some(ext => ext.exten === extension);
  }

  constructor({ id, extensions, endpointCustom, endpointSccp, endpointSip }: LineArguments = {}) {
    this.id = id;
    this.extensions = extensions;
    this.endpointCustom = endpointCustom || null;
    this.endpointSccp = endpointSccp || null;
    this.endpointSip = endpointSip || null;

    // Useful to compare instead of instanceof with minified code
    this.type = 'Line';
  }
}
