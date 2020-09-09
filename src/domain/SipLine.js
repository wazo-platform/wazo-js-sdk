// @flow
import newFrom from '../utils/new-from';
import Session from './Session';
import type { Endpoint } from './Line';

const availableCodecs = ['vp8', 'vp9', 'h264'];
export const MINIMUM_WAZO_ENGINE_VERSION_FOR_PJSIP = '20.13';

type SipLineResponse = {
  id: number,
  uuid: string,
  tenant_uuid: string,
  username: string,
  secret: string,
  type: string,
  host: string,
  options: ?Array<Array<string>>,
  endpoint_section_options: ?Array<Array<string>>,
  links: Array<Object>,
  trunk: ?string,
  line: Endpoint,
};

type SipLineArguments = {
  id: number,
  uuid: string,
  tenantUuid: string,
  username: string,
  secret: string,
  type: string,
  host: string,
  options: ?Array<Array<string>>,
  endpointSectionOptions: ?Array<Array<string>>,
  links: Array<Object>,
  trunk: ?string,
  line: Endpoint,
};

export default class SipLine {
  id: any;
  uuid: string;
  tenantUuid: string;
  username: string;
  secret: string;
  type: string;
  host: string;
  options: ?Array<Array<string>>;
  endpointSectionOptions: ?Array<Array<string>>;
  links: Array<Object>;
  trunk: ?string;
  line: Endpoint;

  static parse(plain: SipLineResponse): SipLine {
    return new SipLine({
      id: plain.id,
      uuid: plain.uuid,
      tenantUuid: plain.tenant_uuid,
      username: plain.username,
      secret: plain.secret,
      type: plain.type,
      host: plain.host,
      options: plain.options,
      endpointSectionOptions: plain.endpoint_section_options,
      links: plain.links,
      trunk: plain.trunk,
      line: plain.line,
    });
  }

  static newFrom(sipLine: SipLine) {
    return newFrom(sipLine, SipLine);
  }

  is(line: SipLine) {
    if (line.uuid) {
      return this.uuid === line.uuid;
    }
    return this.id === line.id;
  }

  getOptions(session: Session): Array<Object> {
    if (session.hasEngineVersionGte(MINIMUM_WAZO_ENGINE_VERSION_FOR_PJSIP)) {
      return this.endpointSectionOptions || [];
    }

    return this.options || [];
  }

  isWebRtc(session: Session) {
    return this.getOptions(session).some(option => option[0] === 'webrtc' && option[1] === 'yes');
  }

  hasVideo(session: Session) {
    const allow = this.getOptions(session).find(option => option[0] === 'allow');
    return Array.isArray(allow) && allow[1].split(',').some(codec => availableCodecs.some(c => c === codec));
  }

  hasVideoConference(session: Session) {
    return (
      this.getOptions(session).some(option => option[0] === 'max_audio_streams' && parseInt(option[1], 10) > 0)
      && this.getOptions(session).some(option => option[0] === 'max_video_streams' && parseInt(option[1], 10) > 1)
    );
  }

  constructor({
    id,
    uuid,
    tenantUuid,
    username,
    secret,
    type,
    host,
    options,
    endpointSectionOptions,
    links,
    trunk,
    line,
  }: SipLineArguments = {}) {
    this.id = id;
    this.uuid = uuid;
    this.tenantUuid = tenantUuid;
    this.username = username;
    this.secret = secret;
    this.type = type;
    this.host = host;
    this.options = options;
    this.endpointSectionOptions = endpointSectionOptions;
    this.links = links;
    this.trunk = trunk;
    this.line = line;

    // Useful to compare instead of instanceof with minified code
    this.type = 'SipLine';
  }
}
