import newFrom from '../utils/new-from';

type Extension = {
  context: string;
  exten: string;
  id: number;
  links?: Array<{
    href: string;
    rel: string;
  }>;
};
export type Endpoint = {
  id: number;
  links: Array<{
    href: string;
    rel: string;
  }>;
  username?: string;
};
type LineResponse = {
  endpoint_custom: Endpoint | null | undefined;
  endpoint_sccp: Endpoint | null | undefined;
  endpoint_sip: Endpoint | null | undefined;
  extensions: Array<Extension>;
  id: number;
};
type LineArguments = {
  id?: number;
  extensions?: Array<Extension>;
  endpointCustom?: Endpoint | null;
  endpointSccp?: Endpoint | null;
  endpointSip?: Endpoint | null;
};
export default class Line {
  type: string;

  id: number | undefined;

  extensions: Array<Extension> | undefined;

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

  is(line: Line | null | undefined) {
    return line ? this.id === line.id : false;
  }

  hasExtension(extension: string) {
    if (!this.extensions) {
      return false;
    }

    return this.extensions.some(ext => ext.exten === extension);
  }

  constructor({
    id,
    extensions,
    endpointCustom,
    endpointSccp,
    endpointSip,
  }: LineArguments = {}) {
    this.id = id;
    this.extensions = extensions;
    this.endpointCustom = endpointCustom || null;
    this.endpointSccp = endpointSccp || null;
    this.endpointSip = endpointSip || null;
    // Useful to compare instead of instanceof with minified code
    this.type = 'Line';
  }

}
