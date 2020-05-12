// @flow
import Emitter from '../../utils/Emitter';

class Participant extends Emitter {
  uuid: string;
  name: string;
  number: string;
  callId: string;
  isTalking: boolean;
  streams: any[];
  videoStreams: any[];
  audioMuted: boolean;
  videoMuted: boolean;
  screensharing: boolean;
  extra: Object;

  ON_UPDATED: string;
  ON_START_TALKING: string;
  ON_STOP_TALKING: string;
  ON_DISCONNECT: string;
  ON_STREAM_SUBSCRIBED: string;
  ON_STREAM_UNSUBSCRIBED: string;
  ON_AUDIO_MUTED: string;
  ON_AUDIO_UNMUTED: string;
  ON_VIDEO_MUTED: string;
  ON_VIDEO_UNMUTED: string;
  ON_SCREENSHARING: string;
  ON_STOP_SCREENSHARING: string;

  /**
   * @param rawParticipant string Participant sent via the Wazo WS
   * @param extra Object extra status of the participant
   */
  constructor(rawParticipant: Object = {}, extra: Object = {}) {
    super();

    this.uuid = rawParticipant.user_uuid;
    this.name = (rawParticipant.caller_id_name || '').replace("\\'", "'");
    this.number = rawParticipant.caller_id_number;
    this.callId = rawParticipant.call_id;
    this.isTalking = false;
    this.streams = [];
    this.videoStreams = [];
    this.audioMuted = false;
    this.videoMuted = false;
    this.screensharing = false;
    this.extra = extra;

    this.ON_UPDATED = 'participant/ON_UPDATED';
    this.ON_START_TALKING = 'participant/ON_START_TALKING';
    this.ON_STOP_TALKING = 'participant/ON_STOP_TALKING';
    this.ON_DISCONNECT = 'participant/ON_DISCONNECT';
    this.ON_STREAM_SUBSCRIBED = 'participant/ON_STREAM_SUBSCRIBED';
    this.ON_STREAM_UNSUBSCRIBED = 'participant/ON_STREAM_UNSUBSCRIBED';
    this.ON_AUDIO_MUTED = 'participant/ON_AUDIO_MUTED';
    this.ON_AUDIO_UNMUTED = 'participant/ON_AUDIO_UNMUTED';
    this.ON_VIDEO_MUTED = 'participant/ON_VIDEO_MUTED';
    this.ON_VIDEO_UNMUTED = 'participant/ON_VIDEO_UNMUTED';
    this.ON_SCREENSHARING = 'participant/ON_SCREENSHARING';
    this.ON_STOP_SCREENSHARING = 'participant/ON_STOP_SCREENSHARING';
  }

  triggerEvent(name: string, ...args: any[]) {
    this.eventEmitter.emit.apply(this.eventEmitter, [name, ...args]);
    this.eventEmitter.emit(this.ON_UPDATED);
  }

  onTalking(isTalking: boolean) {
    this.isTalking = isTalking;
    this.triggerEvent(this.isTalking ? this.ON_START_TALKING : this.ON_STOP_TALKING);
  }

  onDisconnect() {
    return this.triggerEvent(this.ON_DISCONNECT);
  }

  onStreamSubscribed(stream: any) {
    return this.triggerEvent(this.ON_STREAM_SUBSCRIBED, stream);
  }

  onStreamUnSubscribed(stream: any) {
    return this.triggerEvent(this.ON_STREAM_UNSUBSCRIBED, stream);
  }

  onAudioMuted() {
    if (this.audioMuted) {
      return;
    }
    this.audioMuted = true;

    this.triggerEvent(this.ON_AUDIO_MUTED);
  }

  onAudioUnMuted() {
    if (!this.audioMuted) {
      return;
    }
    this.audioMuted = false;

    this.triggerEvent(this.ON_AUDIO_UNMUTED);
  }

  onVideoMuted() {
    if (this.videoMuted) {
      return;
    }
    this.videoMuted = true;

    this.triggerEvent(this.ON_VIDEO_MUTED);
  }

  onVideoUnMuted() {
    if (!this.videoMuted) {
      return;
    }
    this.videoMuted = false;

    this.triggerEvent(this.ON_VIDEO_UNMUTED);
  }

  onScreensharing() {
    if (this.screensharing) {
      return;
    }
    this.screensharing = true;

    this.triggerEvent(this.ON_SCREENSHARING);
  }

  onStopScreensharing() {
    if (!this.screensharing) {
      return;
    }
    this.screensharing = false;

    this.triggerEvent(this.ON_STOP_TALKING);
  }

  getStatus() {
    return {
      callId: this.callId,
      audioMuted: this.audioMuted,
      videoMuted: this.videoMuted,
      screensharing: this.screensharing,
      extra: this.extra,
    };
  }

  updateStatus(status: Object) {
    if (status.audioMuted !== this.audioMuted) {
      if (status.audioMuted) {
        this.onAudioMuted();
      } else {
        this.onAudioUnMuted();
      }
    }

    if (status.videoMuted !== this.videoMuted) {
      if (status.videoMuted) {
        this.onVideoMuted();
      } else {
        this.onVideoUnMuted();
      }
    }

    if (status.screensharing !== this.screensharing) {
      if (status.screensharing) {
        this.onScreensharing();
      } else {
        this.onStopScreensharing();
      }
    }

    // Poor man's object comparision
    if (JSON.stringify(this.extra) !== JSON.stringify(status.extra)) {
      this.extra = { ...this.extra, ...status.extra };
      this.eventEmitter.emit(this.ON_UPDATED);
    }
  }
}

export default Participant;
