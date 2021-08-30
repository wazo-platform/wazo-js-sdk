/* global document */
// @flow
import type { Message } from 'sip.js/lib/api/message';
import sdpParser from 'sdp-transform';

import type CallSession from '../../domain/CallSession';
import getApiClient from '../../service/getApiClient';
import Emitter from '../../utils/Emitter';
import Wazo from '../index';
import Participant from './Participant';
import RemoteParticipant from './RemoteParticipant';
import IssueReporter from '../../service/IssueReporter';

export const SIGNAL_TYPE_PARTICIPANT_UPDATE = 'signal/PARTICIPANT_UPDATE';
export const SIGNAL_TYPE_PARTICIPANT_REQUEST = 'signal/PARTICIPANT_REQUEST';

const logger = IssueReporter.loggerFor('sdk-room');

class Room extends Emitter {
  callSession: ?CallSession;
  name: string;
  extension: string;
  sourceId: ?number;
  participants: Participant[];
  callId: ?string;
  connected: boolean;
  localParticipant: ?Participant;
  _callIdStreamIdMap: Object;
  _unassociatedVideoStreams: Object;
  _unassociatedParticipants: Object;
  _boundOnParticipantJoined: Function;
  _boundOnParticipantLeft: Function;
  _boundOnMessage: Function;
  _boundOnChat: Function;
  _boundOnSignal: Function;
  _boundSaveLocalVideoStream: Function;
  _boundOnReinvite: Function;
  audioStream: ?any;
  extra: Object;
  // video tag representing the room audio stream
  roomAudioElement: any;

  CONFERENCE_USER_PARTICIPANT_JOINED: string;
  CONFERENCE_USER_PARTICIPANT_LEFT: string;
  ON_SHARE_SCREEN_ENDED: string;
  ON_MESSAGE: string;
  ON_CHAT: string;
  ON_SIGNAL: string;
  ON_AUDIO_STREAM: string;
  ON_VIDEO_STREAM: string;
  ON_REMOVE_STREAM: string;
  ON_DISCONNECTED: string;
  ON_JOINED: string;
  ON_VIDEO_INPUT_CHANGE: string;

  /**
   *
   * @param callSession CallSession
   * @param extension string
   * @param sourceId number
   * @param callId string
   * @param extra Object
   */
  constructor(
    callSession: CallSession,
    extension: string,
    sourceId: ?number,
    callId: ?string,
    extra: Object = {},
  ) {
    super();
    logger.info('room initialized', { callId, extension, sourceId });

    // Represents the room callSession
    this.callSession = callSession;
    this.extension = extension;
    this.sourceId = sourceId;
    this.callId = callId;
    this.participants = [];
    this.connected = false;
    this.localParticipant = null;
    // [callId]: streamId
    this._callIdStreamIdMap = {};
    // Stream not yet associated to a participant, [streamId]: stream
    this._unassociatedVideoStreams = {};
    // Participant not yet associated to a stream, [participant.callId = label in setDescription]: Participant
    this._unassociatedParticipants = {};

    // The shared audio stream of the room
    this.audioStream = null;
    // Extra values passed to local participant
    this.extra = extra;

    // Sugar syntax for `room.EVENT_NAME`
    this.CONFERENCE_USER_PARTICIPANT_JOINED = Wazo.Websocket.CONFERENCE_USER_PARTICIPANT_JOINED;
    this.CONFERENCE_USER_PARTICIPANT_LEFT = Wazo.Websocket.CONFERENCE_USER_PARTICIPANT_LEFT;
    this.ON_SHARE_SCREEN_ENDED = Wazo.Phone.ON_SHARE_SCREEN_ENDED;
    this.ON_MESSAGE = Wazo.Phone.ON_MESSAGE;
    this.ON_CHAT = Wazo.Phone.ON_CHAT;
    this.ON_SIGNAL = Wazo.Phone.ON_SIGNAL;

    this.ON_AUDIO_STREAM = Wazo.Phone.ON_AUDIO_STREAM;
    this.ON_VIDEO_STREAM = Wazo.Phone.ON_VIDEO_STREAM;
    this.ON_REMOVE_STREAM = Wazo.Phone.ON_REMOVE_STREAM;
    this.ON_VIDEO_INPUT_CHANGE = Wazo.Phone.ON_VIDEO_INPUT_CHANGE;
    this.ON_DISCONNECTED = 'room/ON_DISCONNECTED';
    this.ON_JOINED = 'room/ON_JOINED';

    this._boundOnParticipantJoined = this._onParticipantJoined.bind(this);
    this._boundOnParticipantLeft = this._onParticipantLeft.bind(this);
    this._boundOnMessage = this._onMessage.bind(this);
    this._boundOnChat = this._onChat.bind(this);
    this._boundOnSignal = this._onSignal.bind(this);
    this._boundSaveLocalVideoStream = this._saveLocalVideoStream.bind(this);
    this._boundOnReinvite = this._onReinvite.bind(this);

    this.unbind();

    this._bindEvents();

    this._transferEvents();
  }

  /**
   *
   * @param extension string
   * @param constraints string
   * @param audioOnly boolean
   * @param extra Object
   * @param room ?Room
   * @returns {Promise<Room>}
   */
  static async connect({ extension, constraints, audioOnly = false, extra, room }: Object) {
    logger.info('connecting to room', { extension, audioOnly, room: !!room });

    if (!room) {
      await Wazo.Phone.connect();

      const withCamera = constraints && !!constraints.video;

      if (withCamera) {
        Wazo.Phone.checkSfu();
      }

      // Call_created is triggered before call_accepted, so we have to listen for it here.
      Wazo.Websocket.once(Wazo.Websocket.CALL_CREATED, ({ data }) => {
        logger.info('room call received via WS', { callId: data.call_id });
        if (room) {
          room.setCallId(data.call_id);
        }
      });

      const callSession = await Wazo.Phone.call(extension, withCamera, null, audioOnly, true);
      // eslint-disable-next-line no-param-reassign
      room = new Room(callSession, extension, null, null, extra);

      // Wait for the call to be accepted
      await new Promise((resolve, reject) => {
        Wazo.Phone.once(Wazo.Phone.ON_CALL_ACCEPTED, resolve);
        Wazo.Phone.once(Wazo.Phone.ON_CALL_FAILED, reject);
      });
    }

    if (room && room.callSession && room.callSession.call) {
      room.setCallId(room.callSession.call.id);
    }

    // Fetch conference source
    const sources = await getApiClient().dird.fetchConferenceSource('default');
    // Retrieve conference sources
    const contacts = await getApiClient().dird.fetchConferenceContacts(sources.items[0]);
    // Retrieve conference
    const conference = contacts.find(contact => contact.numbers.find(number => number.number === extension));

    logger.info('connected to room', {
      sourceId: conference ? conference.sourceId : null,
      name: conference ? conference.name : null,
    });

    if (conference) {
      room.setSourceId(conference.sourceId);
      room.setName(conference.name);
    }

    return room;
  }

  static disconnect() {
    logger.info('static disconnection to room');

    Wazo.Phone.disconnect();
  }

  async disconnect() {
    logger.info('disconnection to room called');

    await Wazo.Phone.hangup(this.callSession);
    this.callSession = null;
    this.eventEmitter.emit(this.ON_DISCONNECTED, this);
    this.connected = false;
    this.unbind();

    Wazo.Phone.off(this.ON_MESSAGE, this._boundOnMessage);
    Wazo.Phone.off(this.ON_CHAT, this._boundOnChat);
    Wazo.Phone.off(this.ON_SIGNAL, this._boundOnSignal);
    Wazo.Phone.off(this.ON_VIDEO_INPUT_CHANGE, this._boundSaveLocalVideoStream);
    Wazo.Phone.phone.off(Wazo.Phone.phone.client.ON_REINVITE, this._boundOnReinvite);
    Wazo.Websocket.off(this.CONFERENCE_USER_PARTICIPANT_JOINED, this._boundOnParticipantJoined);
    Wazo.Websocket.off(this.CONFERENCE_USER_PARTICIPANT_LEFT, this._boundOnParticipantLeft);

    if (this.roomAudioElement && document.body) {
      document.body.removeChild(this.roomAudioElement);
    }
  }

  setSourceId(sourceId: number) {
    logger.info('set room source id', { sourceId });

    this.sourceId = sourceId;
  }

  setCallId(callId: string) {
    logger.info('set room call id', { callId });

    if (callId) {
      this.callId = callId;
    }
  }

  setName(name: string) {
    logger.info('set room name', { name });

    this.name = name;
  }

  // @TODO: change sipSession to callSession
  sendMessage(body: string, sipSession: any = null) {
    return Wazo.Phone.sendMessage(body, sipSession);
  }

  sendChat(content: string) {
    return Wazo.Phone.sendChat(content);
  }

  sendSignal(content: any) {
    return Wazo.Phone.sendSignal(content);
  }

  async startScreenSharing(constraints: Object) {
    logger.info('start room screen sharing', { constraints });

    const screensharingStream = await Wazo.Phone.startScreenSharing(constraints, this.callSession);
    if (!screensharingStream) {
      console.warn('screensharing stream is null (likely due to user cancellation)');
      return null;
    }

    this._onScreenSharing();

    return screensharingStream;
  }

  stopScreenSharing(restoreLocalStream: boolean = true) {
    logger.info('stop room screen sharing');

    Wazo.Phone.stopScreenSharing(this.callSession, restoreLocalStream);

    if (this.localParticipant) {
      this.localParticipant.onStopScreensharing();
    }
  }

  turnCameraOff() {
    logger.info('turn room camera off');

    Wazo.Phone.turnCameraOff(this.callSession);

    if (this.localParticipant) {
      this.localParticipant.onVideoMuted();
    }
  }

  turnCameraOn() {
    logger.info('turn room camera on');

    Wazo.Phone.turnCameraOn(this.callSession);

    if (this.localParticipant) {
      this.localParticipant.onVideoUnMuted();
    }
  }

  mute() {
    logger.info('mute room');

    Wazo.Phone.mute(this.callSession);

    this.sendMuteStatus();
  }

  unmute() {
    logger.info('unmute room');

    Wazo.Phone.unmute(this.callSession);

    this.sendUnMuteStatus();
  }

  sendMuteStatus() {
    if (this.localParticipant) {
      this.localParticipant.onAudioMuted();
    }
  }

  sendUnMuteStatus() {
    if (this.localParticipant) {
      this.localParticipant.onAudioUnMuted();
    }
  }

  hold() {
    logger.info('hold room');

    Wazo.Phone.hold(this.callSession, true);

    if (this.localParticipant) {
      this.localParticipant.onHold();
    }
  }

  resume() {
    logger.info('resume room');

    Wazo.Phone.resume(this.callSession, true);

    if (this.localParticipant) {
      this.localParticipant.onResume();
    }
  }

  sendDTMF(tone: string) {
    logger.info('send room DTMF', { tone });

    Wazo.Phone.sendDTMF(tone, this.callSession);
  }

  async sendReinvite(newConstraints: Object = null) {
    logger.info('send room reinvite', { callId: this.callSession ? this.callSession.getId() : null, newConstraints });
    const wasScreensharing = this.localParticipant && this.localParticipant.screensharing;

    Wazo.Phone.on(Wazo.Phone.ON_SHARE_SCREEN_STARTED, () => {
      if (Wazo.Phone.phone && Wazo.Phone.phone.currentScreenShare) {
        this._onScreenSharing();
      }
    });

    const response = await Wazo.Phone.phone.sendReinvite(this.callSession, newConstraints, true);

    if (this.localParticipant && newConstraints && newConstraints.video) {
      const localVideoStream = Wazo.Phone.phone.getLocalVideoStream(this.callSession);
      if (localVideoStream) {
        // $FlowFixMe
        this._associateStreamTo(localVideoStream, this.localParticipant);
      }
    } else if (this.localParticipant && wasScreensharing && newConstraints && !newConstraints.video) {
      // Downgrade from screenshare to audio
      this.localParticipant.onStopScreensharing();
    }

    return response;
  }

  _bindEvents() {
    if (!Wazo.Phone.phone || !Wazo.Phone.phone.currentSipSession) {
      return;
    }
    // Retrieve mapping
    Wazo.Phone.phone.currentSipSession.sessionDescriptionHandler.on('setDescription', ({ type, sdp: rawSdp }) => {
      if (type !== 'offer') {
        return;
      }

      this._mapMsid(rawSdp);
    });

    // Listen to REINVITE to ba able to map msid after upgrading to video in a  audio only conference
    // This allow to map msid with the non parsed (eg without the `stripVideo` modifier) SDP
    Wazo.Phone.phone.on(Wazo.Phone.phone.client.ON_REINVITE, this._boundOnReinvite);

    this.on(this.ON_AUDIO_STREAM, stream => {
      logger.info('on room audio stream');

      this.audioStream = stream;
      if (document.createElement) {
        // $FlowFixMe
        let roomAudioElement: HTMLAudioElement = document.getElementById('audio-room');
        if (!this.roomAudioElement) {
          roomAudioElement = document.createElement('audio');
          // $FlowFixMe
          document.body.appendChild(roomAudioElement);
        }
        if (!roomAudioElement) {
          return;
        }
        this.roomAudioElement = roomAudioElement;
        this.roomAudioElement.srcObject = stream;
        this.roomAudioElement.autoplay = true;
        this.roomAudioElement.id = 'audio-room';

        // $FlowFixMe
        if (this.roomAudioElement.setSinkId) {
          // $FlowFixMe
          this.roomAudioElement.setSinkId(Wazo.Phone.getOutputDevice());
        }
      }
    });

    this.on(this.ON_VIDEO_STREAM, (stream, streamId) => {
      logger.info('on room video stream', { streamId });

      // ON_VIDEO_STREAM is called before PARTICIPANT_JOINED, so we have to keep stream in `_unassociatedVideoStreams`.
      this._unassociatedVideoStreams[streamId] = stream;

      const callId = this._getCallIdFromStreamId(streamId);
      const participant = callId ? this._getParticipantFromCallId(callId) : null;
      if (participant) {
        this.__associateStreams(participant);
      }
    });

    this.on(this.ON_REMOVE_STREAM, stream => {
      logger.info('on room remove stream');

      const participant = this.participants.find(someParticipant =>
        someParticipant.streams.find(someStream => someStream && someStream.id === stream.id));
      if (!participant) {
        return;
      }

      participant.videoStreams = participant.videoStreams.filter(someStream => someStream.id !== stream.id);
      participant.streams = participant.streams.filter(someStream => someStream.id !== stream.id);
      participant.onStreamUnSubscribed(stream);
    });
  }

  _onScreenSharing() {
    if (this.localParticipant) {
      this.localParticipant.onScreensharing();
    }
  }

  _onReinvite(session: any, inviteRequest: any) {
    const body = inviteRequest.body || inviteRequest.message.body;
    if (body) {
      this._mapMsid(body);

      // Re-associate video streams
      this.participants.forEach(participant => {
        this.__associateStreams(participant);
      });
    }
  }

  _mapMsid(rawSdp: String) {
    const sdp = sdpParser.parse(rawSdp);
    const labelMsidArray = sdp.media.filter(media => !!media.label).map(({ label, msid }) => ({
      label: String(label),
      msid: msid.split(' ')[1],
    }));

    labelMsidArray.forEach(({ label, msid }) => {
      this._callIdStreamIdMap[String(label)] = msid;

      const callId = String(label);
      const participant = this._unassociatedParticipants[callId] || this._getParticipantFromCallId(callId);
      if (participant) {
        this.__associateStreams(participant);
      }
    });
  }

  _transferEvents() {
    Wazo.Websocket.on(this.CONFERENCE_USER_PARTICIPANT_JOINED, this._boundOnParticipantJoined);
    Wazo.Websocket.on(this.CONFERENCE_USER_PARTICIPANT_LEFT, this._boundOnParticipantLeft);

    // Phone events
    Wazo.Phone.on(this.ON_MESSAGE, this._boundOnMessage);
    Wazo.Phone.on(this.ON_CHAT, this._boundOnChat);
    Wazo.Phone.on(this.ON_SIGNAL, this._boundOnSignal);
    Wazo.Phone.on(this.ON_VIDEO_INPUT_CHANGE, this._boundSaveLocalVideoStream);

    [this.ON_AUDIO_STREAM, this.ON_VIDEO_STREAM, this.ON_REMOVE_STREAM].forEach(event =>
      Wazo.Phone.on(event, (...args) => this.eventEmitter.emit.apply(this.eventEmitter, [event, ...args])));
  }

  _onMessage(message: Message) {
    if (message.method !== 'MESSAGE') {
      return;
    }
    let body;
    try {
      body = JSON.parse(message.body);
    } catch (e) {
      return;
    }

    switch (body.type) {
      case 'ConfbridgeTalking': {
        // Update participant
        const channel = body.channels[0];
        const { id: callId, talking_status: talkingStatus } = channel;
        const isTalking = talkingStatus === 'on';
        const participantIdx = this.participants.findIndex(participant => participant.callId === callId);
        if (participantIdx === -1) {
          return;
        }
        this.participants[participantIdx].onTalking(isTalking);
        break;
      }

      default:
    }

    this.eventEmitter.emit(this.ON_MESSAGE, body);
  }

  _onChat(content: Object) {
    this.eventEmitter.emit(this.ON_CHAT, content);
  }

  _onSignal(content: Object) {
    const { type } = content;

    switch (type) {
      // we're receiving a external update
      case SIGNAL_TYPE_PARTICIPANT_UPDATE: {
        const { status } = content;
        const participant: ?Participant = this._getParticipantFromCallId(status.callId);

        if (participant) {
          // we're received, so no need to broadcast, hence the input false arg
          participant.updateStatus(status, false);
        }
        break;
      }

      // this is a request to broadcast our current status
      case SIGNAL_TYPE_PARTICIPANT_REQUEST: {
        const { callId, origin } = content;
        // callId is null, someone's requesting everyone's state;
        // or callId is set and matches ours;
        if (this.localParticipant && (!callId || callId === this.localParticipant.callId)) {
          this.localParticipant.broadcastStatus();
        }

        // might as well update the requester's status
        const requester: ?Participant = this._getParticipantFromCallId(origin.callId);
        if (requester) {
          // @FIXME?: when need to trigger an update on join-in; this is a bit of a hack
          logger.info('trigger room requester status', { origin });
          requester.triggerUpdate('REQUESTER_UPDATE');
        }
        break;
      }

      case Wazo.Phone.ON_MESSAGE_TRACK_UPDATED: {
        const { callId, update } = content;
        const participantIdx = this.participants.findIndex(p => p.callId === callId);
        if (participantIdx !== -1) {
          this.participants[participantIdx] = this._onParticipantTrackUpdate(this.participants[participantIdx], update);
        }

        break;
      }

      default: {
        console.warn('uncaught signal', content);
      }
    }

    this.eventEmitter.emit(Wazo.Phone.ON_SIGNAL, content);
  }

  async _onParticipantJoined(payload: Object) {
    const participant = payload.data;
    const session = Wazo.Auth.getSession();
    let participants = [];

    // @TODO: we could use a better function name here
    const isJoining = part => {
      this.__associateStreams(part);
      // @VALIDATE: no need to publicize ourselves, no?
      if (part instanceof RemoteParticipant) {
        this.eventEmitter.emit(this.CONFERENCE_USER_PARTICIPANT_JOINED, part);
      }
    };

    // When we join the room, we can call `getConferenceParticipantsAsUser`, not before.
    if (participant.user_uuid === session.uuid) {
      logger.info('room current user joined');

      // Retrieve participants via an API calls
      const conferenceId = this.sourceId || payload.data.conference_id;
      const response = await getApiClient().calld.getConferenceParticipantsAsUser(conferenceId);
      logger.info('fetching conference participants', { conferenceId });
      if (response) {
        logger.info('conference participants fetched', { nb: response.items.length });
        participants = response.items.map(item => {
          const isMe = item.call_id === this.callId;

          return isMe && item.call_id
            ? new Wazo.LocalParticipant(this, item, this.extra)
            : new Wazo.RemoteParticipant(this, item);
        });

        this.participants = participants;

        const localParticipant = participants.find(someParticipant => someParticipant instanceof Wazo.LocalParticipant);
        if (!this.localParticipant && localParticipant) {
          this.localParticipant = localParticipant;

          const localVideoStream = this._getLocalVideoStream();
          if (localVideoStream) {
            this._saveLocalVideoStream(localVideoStream);
          }

          this.connected = true;

          // we're in the room, now let's request everyone's status
          if (this.localParticipant) {
            this.sendSignal({
              type: SIGNAL_TYPE_PARTICIPANT_REQUEST,
              origin: this.localParticipant.getStatus(),
            });
          }
        }

        participants.forEach(someParticipant => isJoining(someParticipant));
        this.eventEmitter.emit(this.ON_JOINED, localParticipant, participants);
      }

      return this.participants;
    }

    const remoteParticipant: ?RemoteParticipant = !this.participants.some(p => p.callId === participant.call_id)
      ? new Wazo.RemoteParticipant(this, participant)
      : null;

    logger.info('other room user joined', { callId: participant.call_id, remoteParticipant: !!remoteParticipant });

    if (remoteParticipant) {
      this.participants.push(remoteParticipant);
      isJoining(remoteParticipant);
    }

    return remoteParticipant;
  }

  _saveLocalVideoStream(stream: MediaStream) {
    const { localParticipant } = this;

    if (!localParticipant) {
      return;
    }

    const videoStream = new Wazo.Stream(stream, localParticipant);

    if (videoStream) {
      localParticipant.streams = [videoStream];
      localParticipant.videoStreams = [videoStream];
      localParticipant.onStreamSubscribed(videoStream);
    }

    return videoStream;
  }

  _onParticipantLeft(payload: Object) {
    const leftParticipant = this.participants.find(participant =>
      participant && participant.callId === payload.data.call_id);

    // Trigger Participant.ON_DISCONNECT event
    if (leftParticipant) {
      leftParticipant.onDisconnect();
    }

    this.participants = this.participants.filter(participant =>
      participant && participant.callId !== payload.data.call_id);
    this.eventEmitter.emit(this.CONFERENCE_USER_PARTICIPANT_LEFT, leftParticipant);
  }

  _onScreenshareEnded() {
    this.stopScreenSharing();

    this.eventEmitter.emit(this.ON_SHARE_SCREEN_ENDED);

    if (this.localParticipant) {
      this.localParticipant.onStopScreensharing();
    }
  }

  _onParticipantTrackUpdate(oldParticipant: Participant, update: string): Participant {
    const newParticipant = oldParticipant;

    const label = this._callIdStreamIdMap[newParticipant.callId];
    const pc = Wazo.Phone.phone.currentSipSession.sessionDescriptionHandler.peerConnection;
    const stream = pc.getRemoteStreams().find(otherStream => otherStream.getTracks().some(track => track.id === label));

    if (update === 'downgrade') {
      newParticipant.streams = [];
      newParticipant.videoStreams = [];
      newParticipant.onStreamUnSubscribed(stream);

      return newParticipant;
    }

    // Upgrade
    if (stream) {
      this._associateStreamTo(stream, newParticipant);
    }

    return newParticipant;
  }

  // Associate audio/video streams to the participant and triggers events on it
  __associateStreams(participant: Participant) {
    const streamId = this._callIdStreamIdMap[participant.callId];
    if (!streamId) {
      this._unassociatedParticipants[participant.callId] = participant;

      return;
    }
    if (!streamId || !participant || !this.localParticipant || participant.callId === this.localParticipant.callId) {
      return;
    }

    if (this._unassociatedVideoStreams[streamId]) {
      // Try to associate stream
      this._associateStreamTo(this._unassociatedVideoStreams[streamId], participant);

      delete this._unassociatedVideoStreams[streamId];
      delete this._unassociatedParticipants[participant.callId];
    }
  }

  _associateStreamTo(rawStream: any, participant: Participant) {
    const stream = new Wazo.Stream(rawStream, participant);
    participant.streams.push(stream);
    participant.videoStreams.push(stream);

    participant.onStreamSubscribed(stream);
  }

  _getCallIdFromStreamId(streamId: string) {
    return Object.keys(this._callIdStreamIdMap).find(key => this._callIdStreamIdMap[key] === streamId);
  }

  _getParticipantFromCallId(callId: string) {
    return this.participants.find(participant => participant.callId === callId);
  }

  _getLocalVideoStream() {
    return Wazo.Phone.getLocalVideoStream(this.callSession);
  }
}

export default Room;
