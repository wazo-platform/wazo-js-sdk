/* global document */
// @flow
import sdpParser from 'sdp-transform';

import SIP from '../../sip';
import type CallSession from '../../domain/CallSession';
import getApiClient from '../../service/getApiClient';
import Emitter from '../../utils/Emitter';
import Wazo from '../index';
import Participant from './Participant';
import RemoteParticipant from './RemoteParticipant';

const MESSAGE_TYPE_CHAT = 'message/TYPE_CHAT';
const MESSAGE_TYPE_SIGNAL = 'message/TYPE_SIGNAL';

export const SIGNAL_TYPE_PARTICIPANT_UPDATE = 'signal/PARTICIPANT_UPDATE';
export const SIGNAL_TYPE_PARTICIPANT_REQUEST = 'signal/PARTICIPANT_REQUEST';

class Room extends Emitter {
  callSession: ?CallSession;
  extension: string;
  sourceId: ?number;
  participants: Participant[];
  callId: ?string;
  connected: boolean;
  localParticipant: ?Participant;
  _callIdStreamIdMap: Object;
  _unassociatedVideoStreams: Object;
  _boundOnParticipantJoined: Function;
  _boundOnParticipantLeft: Function;
  _boundOnScreenshareEnded: Function;
  _boundOnMessage: Function;
  audioStream: ?any;
  audioElement: ?any;
  extra: Object;
  // video tag representing the room audio stream
  roomAudioElement: any;
  verbosity: number;

  CONFERENCE_USER_PARTICIPANT_JOINED: string;
  CONFERENCE_USER_PARTICIPANT_LEFT: string;
  ON_SCREEN_SHARE_ENDED: string;
  ON_MESSAGE: string;
  ON_CHAT: string;
  ON_SIGNAL: string;
  ON_AUDIO_STREAM: string;
  ON_VIDEO_STREAM: string;
  ON_REMOVE_STREAM: string;
  ON_DISCONNECTED: string;
  ON_JOINED: string;

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
    extension: string, sourceId: ?number,
    callId: ?string,
    extra: Object = {},
    verbosity: number = 0,
  ) {
    super();
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

    // The shared audio stream of the room
    this.audioStream = null;
    // Extra values passed to local participant
    this.extra = extra;

    // set debug verbosity
    this.verbosity = verbosity;

    // Sugar syntax for `room.EVENT_NAME`
    this.CONFERENCE_USER_PARTICIPANT_JOINED = Wazo.Websocket.CONFERENCE_USER_PARTICIPANT_JOINED;
    this.CONFERENCE_USER_PARTICIPANT_LEFT = Wazo.Websocket.CONFERENCE_USER_PARTICIPANT_LEFT;
    this.ON_SCREEN_SHARE_ENDED = Wazo.Phone.ON_SCREEN_SHARE_ENDED;
    this.ON_MESSAGE = Wazo.Phone.ON_MESSAGE;
    this.ON_CHAT = 'room/ON_CHAT';
    this.ON_SIGNAL = 'room/ON_SIGNAL';
    this.ON_AUDIO_STREAM = Wazo.Phone.ON_AUDIO_STREAM;
    this.ON_VIDEO_STREAM = Wazo.Phone.ON_VIDEO_STREAM;
    this.ON_REMOVE_STREAM = Wazo.Phone.ON_REMOVE_STREAM;
    this.ON_DISCONNECTED = 'room/ON_DISCONNECTED';
    this.ON_JOINED = 'room/ON_JOINED';

    this._boundOnParticipantJoined = this._onParticipantJoined.bind(this);
    this._boundOnParticipantLeft = this._onParticipantLeft.bind(this);
    this._boundOnMessage = this._onMessage.bind(this);
    this._boundOnScreenshareEnded = this._onScreenshareEnded.bind(this);

    this.unbind();

    this._bindEvents();

    this._transferEvents();
  }

  /**
   *
   * @param extension string
   * @param constraints string
   * @returns {Promise<Room>}
   */
  static async connect({ extension, constraints, extra, verbosity }: Object) {
    await Wazo.Phone.connect({ media: constraints });
    Wazo.Phone.checkSfu();

    const callSession = await Wazo.Phone.call(extension, constraints && !!constraints.video);
    const room = new Room(callSession, extension, null, null, extra, verbosity);

    // Call_created is triggered before call_accepted, so we have to listen for it here.
    let callId = '';
    Wazo.Websocket.once(Wazo.Websocket.CALL_CREATED, ({ data }) => {
      callId = data.call_id;
    });

    // Wait for the call to be accepted
    await new Promise((resolve, reject) => {
      Wazo.Phone.once(Wazo.Phone.ON_CALL_ACCEPTED, resolve);
      Wazo.Phone.once(Wazo.Phone.ON_CALL_FAILED, reject);
    });

    // Fetch conference source
    const sources = await getApiClient().dird.fetchConferenceSource('default');
    // Retrieve conference sources
    const contacts = await getApiClient().dird.fetchConferenceContacts(sources.items[0]);
    // Retrieve conference
    const conference = contacts.find(contact => contact.numbers.find(number => number.number === extension));

    room.setSourceId(conference.sourceId);
    room.setCallId(callId);

    return room;
  }

  static disconnect() {
    Wazo.Phone.disconnect();
  }

  async disconnect() {
    await Wazo.Phone.hangup(this.callSession);
    this.callSession = null;
    this.eventEmitter.emit(this.ON_DISCONNECTED, this);
    this.connected = false;
    this.unbind();

    Wazo.Phone.off(this.ON_MESSAGE, this._boundOnMessage);
    Wazo.Phone.off(this.ON_SCREEN_SHARE_ENDED, this._boundOnScreenshareEnded);
    Wazo.Websocket.off(this.CONFERENCE_USER_PARTICIPANT_JOINED, this._boundOnParticipantJoined);
    Wazo.Websocket.off(this.CONFERENCE_USER_PARTICIPANT_LEFT, this._boundOnParticipantLeft);

    if (this.roomAudioElement && document.body) {
      document.body.removeChild(this.roomAudioElement);
    }
  }

  setSourceId(sourceId: number) {
    this.sourceId = sourceId;
  }

  setCallId(callId: string) {
    this.callId = callId;
  }

  sendMessage(body: string, sipSession: any = null) {
    return Wazo.Phone.sendMessage(body, sipSession);
  }

  sendChat(content: string) {
    return this.sendMessage(JSON.stringify({ type: MESSAGE_TYPE_CHAT, content }));
  }

  sendSignal(content: any) {
    return this.sendMessage(JSON.stringify({ type: MESSAGE_TYPE_SIGNAL, content }));
  }

  async startScreenSharing(constraints: Object) {
    const screensharingStream = await Wazo.Phone.startScreenSharing(constraints);
    if (!screensharingStream) {
      console.warn('screensharing stream is null (likely due to user cancellation)');
      return null;
    }

    if (this.localParticipant) {
      this.localParticipant.onScreensharing();
    }

    return screensharingStream;
  }

  stopScreenSharing() {
    Wazo.Phone.stopScreenSharing();

    if (this.localParticipant) {
      this.localParticipant.onStopScreensharing();
    }
  }

  turnCameraOff() {
    Wazo.Phone.turnCameraOff(this.callSession);

    if (this.localParticipant) {
      this.localParticipant.onVideoMuted();
    }
  }

  turnCameraOn() {
    Wazo.Phone.turnCameraOn(this.callSession);

    if (this.localParticipant) {
      this.localParticipant.onVideoUnMuted();
    }
  }

  mute() {
    Wazo.Phone.mute(this.callSession);

    if (this.localParticipant) {
      this.localParticipant.onAudioMuted();
    }
  }

  unmute() {
    Wazo.Phone.unmute(this.callSession);

    if (this.localParticipant) {
      this.localParticipant.onAudioUnMuted();
    }
  }

  sendDTMF(tone: string) {
    Wazo.Phone.sendDTMF(this.callSession, tone);
  }

  _bindEvents() {
    // Retrieve mapping
    Wazo.Phone.phone.currentSipSession.sessionDescriptionHandler.on('setDescription', ({ type, sdp: rawSdp }) => {
      if (type !== 'offer') {
        return;
      }
      const sdp = sdpParser.parse(rawSdp);
      const labelMsidArray = sdp.media.filter(media => !!media.label).map(({ label, msid }) => ({
        label: String(label),
        msid: msid.split(' ')[1],
      }));

      labelMsidArray.forEach(({ label, msid }) => {
        this._callIdStreamIdMap[String(label)] = msid;
      });
    });

    this.on(this.ON_AUDIO_STREAM, stream => {
      this.audioStream = stream;
      if (document.createElement) {
        this.roomAudioElement = document.createElement('audio');
        this.roomAudioElement.srcObject = stream;
        this.roomAudioElement.autoplay = true;
        if (document.body) {
          document.body.appendChild(this.roomAudioElement);
        }
      }
    });

    this.on(this.ON_VIDEO_STREAM, (stream, streamId) => {
      // ON_VIDEO_STREAM is called before PARTICIPANT_JOINED, so we have to keep stream in `_unassociatedVideoStreams`.
      this._unassociatedVideoStreams[streamId] = stream;
    });

    this.on(this.ON_REMOVE_STREAM, stream => {
      const participant = this.participants.find(someParticipant =>
        someParticipant.streams.find(someStream => someStream.id === stream.id));
      if (!participant) {
        return;
      }

      participant.videoStreams = participant.videoStreams.filter(someStream => someStream.id !== stream.id);
      participant.streams = participant.streams.filter(someStream => someStream.id !== stream.id);
      participant.onStreamUnSubscribed(stream);
    });
  }

  _transferEvents() {
    Wazo.Websocket.on(this.CONFERENCE_USER_PARTICIPANT_JOINED, this._boundOnParticipantJoined);
    Wazo.Websocket.on(this.CONFERENCE_USER_PARTICIPANT_LEFT, this._boundOnParticipantLeft);

    // Phone events
    Wazo.Phone.on(this.ON_MESSAGE, this._boundOnMessage);
    Wazo.Phone.on(this.ON_SCREEN_SHARE_ENDED, this._boundOnScreenshareEnded);

    [this.ON_AUDIO_STREAM, this.ON_VIDEO_STREAM, this.ON_REMOVE_STREAM].forEach(event =>
      Wazo.Phone.on(event, (...args) => this.eventEmitter.emit.apply(this.eventEmitter, [event, ...args])));
  }

  _onMessage(message: SIP.IncomingRequestMessage) {
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

      case MESSAGE_TYPE_CHAT:
        return this.eventEmitter.emit(this.ON_CHAT, body.content);

      case MESSAGE_TYPE_SIGNAL: {
        this._onSignal(body.content);
        break;
      }

      default:
    }

    this.eventEmitter.emit(this.ON_MESSAGE, body);
  }

  _onSignal(content: Object) {
    const { type: signalType } = content;

    switch (signalType) {
      // we're receiving a external update
      case SIGNAL_TYPE_PARTICIPANT_UPDATE: {
        const { status } = content;
        const participant: ?Participant = this._getParticipantFromCallId(status.callId);

        if (participant) {
          // we're received, so no need to broadcast, hence the input false arg
          this.debug('updatingStatus', status);
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
          this.debug('updatingRequesterStatus', origin);
          requester.updateStatus(origin, false);
        }
        break;
      }

      default: {
        console.warn('uncaught signal', content);
      }
    }
    this.eventEmitter.emit(this.ON_SIGNAL, content);
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
      // Retrieve participants via an API calls
      const response = await getApiClient().calld.getConferenceParticipantsAsUser(this.sourceId);
      if (response) {
        participants = response.items.map(item => {
          const isMe = item.call_id === this.callId;

          return isMe && item.call_id
            ? new Wazo.LocalParticipant(this, item, this.extra)
            : new Wazo.RemoteParticipant(this, item);
        });

        this.participants = participants;

        const localParticipant = participants.find(someParticipant => someParticipant instanceof Wazo.LocalParticipant);
        if (!this.localParticipant && localParticipant) {
          const videoStream = new Wazo.Stream(this._getLocalVideoStream(), localParticipant);
          if (videoStream) {
            localParticipant.streams.push(videoStream);
            localParticipant.videoStreams.push(videoStream);
            localParticipant.onStreamSubscribed(videoStream);
          }
          this.localParticipant = localParticipant;

          this.connected = true;

          // we're in the room, now let's request everyone's status
          this.sendSignal({
            type: SIGNAL_TYPE_PARTICIPANT_REQUEST,
            origin: this.localParticipant.getStatus(),
          });
        }

        participants.forEach(someParticipant => isJoining(someParticipant));
        this.eventEmitter.emit(this.ON_JOINED, localParticipant, participants);
      }

      return this.participants;
    }

    const remoteParticipant: ?RemoteParticipant = !this.participants.some(p => p.callId === participant.call_id)
      ? new Wazo.RemoteParticipant(this, participant)
      : null;

    if (remoteParticipant) {
      this.participants.push(remoteParticipant);
      isJoining(remoteParticipant);
    }

    return remoteParticipant;
  }

  _onParticipantLeft(payload: Object) {
    const leftParticipant = this.participants.find(participant => participant.callId === payload.data.call_id);
    // Trigger Participant.ON_DISCONNECT event
    if (leftParticipant) {
      leftParticipant.onDisconnect();
    }

    this.participants = this.participants.filter(participant => participant.callId !== payload.data.call_id);
    this.eventEmitter.emit(this.CONFERENCE_USER_PARTICIPANT_LEFT, leftParticipant);
  }

  _onScreenshareEnded() {
    this.eventEmitter.emit(this.ON_SCREEN_SHARE_ENDED);
    if (this.localParticipant) {
      this.localParticipant.onStopScreensharing();
    }
  }

  // Associate audio/video streams to the participant and triggers events on it
  __associateStreams(participant: Participant) {
    const streamId = this._callIdStreamIdMap[participant.callId];
    if (!streamId || !participant || !this.localParticipant || participant.callId === this.localParticipant.callId) {
      return;
    }

    if (this._unassociatedVideoStreams[streamId]) {
      // Try to associate stream
      const stream = new Wazo.Stream(this._unassociatedVideoStreams[streamId], participant);
      participant.streams.push(stream);
      participant.videoStreams.push(stream);

      participant.onStreamSubscribed(stream);

      delete this._unassociatedVideoStreams[streamId];
    }
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

  debug(...rest: any) {
    if (this.verbosity) {
      console.info(...rest);
    }
  }
}

export default Room;
