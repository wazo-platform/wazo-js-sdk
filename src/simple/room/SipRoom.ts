import type { Message } from 'sip.js/lib/api/message';
import CallSession from '../../domain/CallSession';
import IssueReporter from '../../service/IssueReporter';
import Wazo from '../index';
import Room from './Room';
import { WazoSession } from '../../domain/types';
import { getSipCallId } from '../../utils/sdp';

const logger = IssueReporter.loggerFor('sdk-sip-room');

class SipRoom extends Room {
  static async connect({
    extension,
    constraints,
    audioOnly = false,
    extra,
    room,
  }: Record<string, any>) {
    logger.info('connecting to sip room', {
      extension,
      audioOnly,
      room: !!room,
    });

    if (!room) {
      await Wazo.Phone.connect({
        media: constraints,
      });
      const withCamera = constraints && !!constraints.video;
      const callSession = await Wazo.Phone.call(extension, withCamera, null, audioOnly, true);
      // eslint-disable-next-line no-param-reassign
      room = new SipRoom(callSession as CallSession, extension, null, null, extra);
    }

    if (room && room.callSession && room.callSession.call) {
      room.setCallId(room.callSession.call.id);
    }

    logger.info('connected to room', {
      extension: room.extension,
    });
    return room;
  }

  mute() {
    logger.info('mute sip room');
    Wazo.Phone.mute(this.callSession as CallSession, false);
    this.sendMuteStatus();
  }

  unmute() {
    logger.info('unmute sip room');
    Wazo.Phone.unmute(this.callSession as CallSession, false);
    this.sendUnMuteStatus();
  }

  getLocalGuestName(): string | null {
    // @ts-ignore: private
    return Wazo.Phone.phone?.client.userAgent?.options.displayName || null;
  }

  // Overridden to not listen to websocket messages
  _transferEvents() {
    // Phone events
    Wazo.Phone.on(this.ON_MESSAGE, this._boundOnMessage);
    Wazo.Phone.on(this.ON_CHAT, this._boundOnChat);
    Wazo.Phone.on(this.ON_SIGNAL, this._boundOnSignal);
    Wazo.Phone.on(this.ON_VIDEO_INPUT_CHANGE, this._boundSaveLocalVideoStream);
    [this.ON_AUDIO_STREAM, this.ON_VIDEO_STREAM, this.ON_REMOVE_STREAM].forEach(event => Wazo.Phone.on(event, (...args: any[]) => this.eventEmitter.emit.apply(this.eventEmitter, [event, ...args])));
  }

  _onMessage(message: Message): Record<string, any> | null | undefined {
    // eslint-disable-next-line no-underscore-dangle
    const body = super._onMessage(message);

    if (!body) {
      return;
    }

    const getChannel = () => body.channels[0];

    switch (body.type) {
      case 'ConfbridgeWelcome':
        body.channels.forEach((channel: any) => {
          this._onParticipantJoined(channel);
        });
        break;

      case 'ConfbridgeJoin':
      {
        const channel = getChannel();

        this._onParticipantJoined(channel);

        break;
      }

      case 'ConfbridgeLeave':
      {
        const channel = getChannel();

        this._onParticipantLeft({
          data: {
            call_id: channel.id,
          },
        });

        break;
      }

      default:
        break;
    }
  }

  async _onParticipantJoined(channel: Record<string, any>): Promise<any> {
    const isLocal = channel.channelvars.WAZO_SIP_CALL_ID === this._getCurrentSipCallIs();

    const callId = channel.id;
    const ParticipantClass = isLocal ? Wazo.LocalParticipant : Wazo.RemoteParticipant;
    const name = channel.caller ? channel.caller.name : null;
    const extra = isLocal ? {
      guestName: this.getLocalGuestName(),
    } : {};

    const participant = new ParticipantClass(this, {
      caller_id_name: name,
      call_id: callId,
    }, extra);

    const participantIdx = this.participants.findIndex(other => other.callId === participant.callId);

    if (participantIdx !== -1 && name) {
      this.participants[participantIdx].name = name;
      return;
    }

    if (isLocal) {
      // Should be updated by the Wazo WS but we don't have it for now
      if (this.callSession) {
        this.callSession.ringing = false;
      }

      this._onLocalParticipantJoined(participant);

      // Give some time for the stream to be updated
      setTimeout(() => {
        this.eventEmitter.emit(this.ON_JOINED, participant, this.participants);
      }, 1000);
    }

    this.participants.push(participant);

    this._isParticipantJoining(participant);

    return participant;
  }

  _getCurrentSipCallIs() {
    return getSipCallId(Wazo.Phone.phone?.currentSipSession as WazoSession);
  }

}

export default SipRoom;
