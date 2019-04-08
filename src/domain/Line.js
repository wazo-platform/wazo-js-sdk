// @flow
import newFrom from '../utils/new-from';

type Extension = {
  context: string,
  exten: string,
  id: number,
  links?: Array<{ href: string, rel: string }>,
};

type Endpoint = {
  id: number,
  links: Array<{href: string, rel: string}>
}

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
  endpointCustom: ?Endpoint,
  endpointSccp: ?Endpoint,
  endpointSip: ?Endpoint,
};

export default class Line {
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

  constructor({ id, extensions, endpointCustom, endpointSccp, endpointSip }: LineArguments = {}) {
    this.id = id;
    this.extensions = extensions;
    this.endpointCustom = endpointCustom || null;
    this.endpointSccp = endpointSccp || null;
    this.endpointSip = endpointSip || null;
  }
}
