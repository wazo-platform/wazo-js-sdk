// @flow
import newFrom from '../utils/new-from';
import type { Endpoint } from './Line';

type SipLineResponse = {
  id: number,
  tenant_uuid: string,
  username: string,
  secret: string,
  type: string,
  host: string,
  options: Array<Array<string>>,
  links: Array<Object>,
  trunk: ?string,
  line: Endpoint,
};

type SipLineArguments = {
  id: number,
  tenantUuid: string,
  username: string,
  secret: string,
  type: string,
  host: string,
  options: Array<Array<string>>,
  links: Array<Object>,
  trunk: ?string,
  line: Endpoint,
};

export default class SipLine {
  type: string;

  id: number;
  tenantUuid: string;
  username: string;
  secret: string;
  type: string;
  host: string;
  options: Array<Array<string>>;
  links: Array<Object>;
  trunk: ?string;
  line: Endpoint;

  static parse(plain: SipLineResponse): SipLine {
    return new SipLine({
      id: plain.id,
      tenantUuid: plain.tenant_uuid,
      username: plain.username,
      secret: plain.secret,
      type: plain.type,
      host: plain.host,
      options: plain.options,
      links: plain.links,
      trunk: plain.trunk,
      line: plain.line,
    });
  }

  static newFrom(sipLine: SipLine) {
    return newFrom(sipLine, SipLine);
  }

  is(line: SipLine) {
    return this.id === line.id;
  }

  isWebRtc() {
    return this.options.some(option => option[0] === 'webrtc' && option[1] === 'yes');
  }

  constructor({ id, tenantUuid, username, secret, type, host, options, links, trunk, line }: SipLineArguments = {}) {
    this.id = id;
    this.tenantUuid = tenantUuid;
    this.username = username;
    this.secret = secret;
    this.type = type;
    this.host = host;
    this.options = options;
    this.links = links;
    this.trunk = trunk;
    this.line = line;

    // Useful to compare instead of instanceof with minified code
    this.type = 'SipLine';
  }
}
