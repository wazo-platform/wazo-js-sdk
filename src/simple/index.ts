/* global window */
import Auth, { InvalidSubscription, InvalidAuthorization, NoTenantIdError, NoDomainNameError } from "./Auth";
import Phone from "./Phone";
import Websocket from "./Websocket";
import Room from "./room/Room";
import SipRoom from "./room/SipRoom";
import RemoteParticipant from "./room/RemoteParticipant";
import LocalParticipant from "./room/LocalParticipant";
import Stream from "./room/Stream";
import Directory from "./Directory";
import Configuration from "./Configuration";
import getApiClient from "../service/getApiClient";
import { createLocalVideoStream, createLocalAudioStream } from "./utils";
import { CanceledCallError } from "../web-rtc-client";
import BadResponse from "../domain/BadResponse";
import ServerError from "../domain/ServerError";
import SFUNotAvailableError from "../domain/SFUNotAvailableError";
import Call from "../domain/Call";
import CallLog from "../domain/CallLog";
import Recording from "../domain/Recording";
import ChatMessage from "../domain/ChatMessage";
import ChatRoom from "../domain/ChatRoom";
import Contact from "../domain/Contact";
import ForwardOption from "../domain/ForwardOption";
import Line from "../domain/Line";
import NotificationOptions from "../domain/NotificationOptions";
import Profile from "../domain/Profile";
import Session from "../domain/Session";
import Voicemail from "../domain/Voicemail";
import Relocation from "../domain/Relocation";
import ConferenceRoom from "../domain/Room";
import CallSession from "../domain/CallSession";
import WebRTCPhone from "../domain/Phone/WebRTCPhone";
import CTIPhone from "../domain/Phone/CTIPhone";
import IndirectTransfer from "../domain/IndirectTransfer";
import SwitchboardCall from "../domain/SwitchboardCall";
import IssueReporter from "../service/IssueReporter";
import Features from "../domain/Features";
import Meeting from "../domain/Meeting";
import Checker from "../checker/Checker";
import Softphone from "./Softphone";
const Wazo = {
  Auth,
  Phone,
  Websocket,
  Room,
  SipRoom,
  RemoteParticipant,
  LocalParticipant,
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
  Softphone,
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
    Meeting
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

  get callLogs() {
    return getApiClient().callLogs;
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
  NoDomainNameError
};

if (window) {
  window.Wazo = Wazo;
}

if (global) {
  global.Wazo = Wazo;
}

export default Wazo;