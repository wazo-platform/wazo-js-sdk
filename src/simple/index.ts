/* eslint-disable import/no-named-as-default */
/* global window */
import type WazoApiClient from '../api-client';
import Checker from '../checker/Checker';
import BadResponse from '../domain/BadResponse';
import Call from '../domain/Call';
import CallLog from '../domain/CallLog';
import CallSession from '../domain/CallSession';
import ChatMessage from '../domain/ChatMessage';
import ChatRoom from '../domain/ChatRoom';
import Contact from '../domain/Contact';
import Features from '../domain/Features';
import ForwardOption from '../domain/ForwardOption';
import IndirectTransfer from '../domain/IndirectTransfer';
import Line from '../domain/Line';
import Meeting from '../domain/Meeting';
import NotificationOptions from '../domain/NotificationOptions';
import CTIPhone from '../domain/Phone/CTIPhone';
import WebRTCPhone from '../domain/Phone/WebRTCPhone';
import Profile from '../domain/Profile';
import Recording from '../domain/Recording';
import Relocation from '../domain/Relocation';
import ConferenceRoom from '../domain/Room';
import ServerError from '../domain/ServerError';
import Session from '../domain/Session';
import SFUNotAvailableError from '../domain/SFUNotAvailableError';
import SwitchboardCall from '../domain/SwitchboardCall';
import Voicemail from '../domain/Voicemail';
import getApiClient from '../service/getApiClient';
import IssueReporter from '../service/IssueReporter';
import { CanceledCallError } from '../web-rtc-client';
import Auth, { InvalidAuthorization, InvalidSubscription, NoDomainNameError, NoSamlRouteError, NoTenantIdError, SamlConfigError } from './Auth';
import Configuration from './Configuration';
import Directory from './Directory';
import Phone from './Phone';
import LocalParticipant from './room/LocalParticipant';
import Participant from './room/Participant';
import RemoteParticipant from './room/RemoteParticipant';
import Room from './room/Room';
import SipRoom from './room/SipRoom';
import Stream from './room/Stream';
import { createLocalAudioStream, createLocalVideoStream } from './utils';
import Websocket from './Websocket';

type WazoType = {
  Auth: typeof Auth;
  Phone: typeof Phone;
  Websocket: typeof Websocket;
  Room: typeof Room;
  SipRoom: typeof SipRoom;
  RemoteParticipant: typeof RemoteParticipant;
  LocalParticipant: typeof LocalParticipant;
  Participant: typeof Participant;
  Stream: typeof Stream;
  createLocalVideoStream: typeof createLocalVideoStream;
  createLocalAudioStream: typeof createLocalAudioStream;
  Configuration: typeof Configuration;
  Directory: typeof Directory;
  getApiClient: typeof getApiClient;
  IssueReporter: typeof IssueReporter;
  loggerFor: typeof IssueReporter.loggerFor;
  Features: typeof Features;
  Checker: typeof Checker;
  domain: {
    BadResponse: typeof BadResponse;
    ServerError: typeof ServerError;
    Call: typeof Call;
    CallLog: typeof CallLog;
    CTIPhone: typeof CTIPhone;
    Recording: typeof Recording;
    ChatMessage: typeof ChatMessage;
    ChatRoom: typeof ChatRoom;
    Contact: typeof Contact;
    ForwardOption: typeof ForwardOption;
    Line: typeof Line;
    NotificationOptions: typeof NotificationOptions;
    Profile: typeof Profile;
    Session: typeof Session;
    Voicemail: typeof Voicemail;
    Relocation: typeof Relocation;
    ConferenceRoom: typeof ConferenceRoom;
    CallSession: typeof CallSession;
    IndirectTransfer: typeof IndirectTransfer;
    SwitchboardCall: typeof SwitchboardCall;
    WebRTCPhone: typeof WebRTCPhone;
    Meeting: typeof Meeting;
  };
  readonly api: WazoApiClient;
  readonly agentd: WazoApiClient['agentd'];
  readonly amid: WazoApiClient['amid'];
  readonly application: WazoApiClient['application'];
  readonly auth: WazoApiClient['auth'];
  readonly callLogd: WazoApiClient['callLogd'];
  readonly calld: WazoApiClient['calld'];
  readonly chatd: WazoApiClient['chatd'];
  readonly confd: WazoApiClient['confd'];
  readonly dird: WazoApiClient['dird'];
  readonly webhookd: WazoApiClient['webhookd'];
  InvalidSubscription: typeof InvalidSubscription;
  InvalidAuthorization: typeof InvalidAuthorization;
  CanceledCallError: typeof CanceledCallError;
  SFUNotAvailableError: typeof SFUNotAvailableError;
  NoTenantIdError: typeof NoTenantIdError;
  NoDomainNameError: typeof NoDomainNameError;
  NoSamlRouteError: typeof NoSamlRouteError;
  SamlConfigError: typeof SamlConfigError;
};

const Wazo: WazoType = {
  Auth,
  Phone,
  Websocket,
  Room,
  SipRoom,
  RemoteParticipant,
  LocalParticipant,
  Participant,
  Stream,
  createLocalVideoStream,
  createLocalAudioStream,
  Configuration,
  Directory,
  getApiClient,
  IssueReporter,
  loggerFor: IssueReporter.loggerFor.bind(IssueReporter),
  Features,
  Checker,
  // Domain
  domain: {
    BadResponse,
    ServerError,
    Call,
    CallLog,
    CTIPhone,
    Recording,
    ChatMessage,
    ChatRoom,
    Contact,
    ForwardOption,
    Line,
    NotificationOptions,
    Profile,
    Session,
    Voicemail,
    Relocation,
    ConferenceRoom,
    CallSession,
    IndirectTransfer,
    SwitchboardCall,
    WebRTCPhone,
    Meeting,
  },

  // Api
  get api() {
    return getApiClient();
  },

  get agentd() {
    return getApiClient().agentd;
  },

  get amid() {
    return getApiClient().amid;
  },

  get application() {
    return getApiClient().application;
  },

  get auth() {
    return getApiClient().auth;
  },

  get callLogd() {
    return getApiClient().callLogd;
  },

  get calld() {
    return getApiClient().calld;
  },

  get chatd() {
    return getApiClient().chatd;
  },

  get confd() {
    return getApiClient().confd;
  },

  get dird() {
    return getApiClient().dird;
  },

  get webhookd() {
    return getApiClient().webhookd;
  },

  // Error
  InvalidSubscription,
  InvalidAuthorization,
  CanceledCallError,
  SFUNotAvailableError,
  NoTenantIdError,
  NoDomainNameError,
  NoSamlRouteError,
  SamlConfigError,
};

if (typeof window !== 'undefined') {
  window.Wazo = Wazo;
}

if (typeof global !== 'undefined') {
  global.Wazo = Wazo;
}

export default Wazo;
