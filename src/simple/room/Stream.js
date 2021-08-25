/* global document */
/* eslint-disable no-param-reassign */
// @flow
import type Participant from './Participant';
import Wazo from '../index';

class Stream {
  htmlStream: MediaStream;
  participant: Participant;

  static detachStream(stream: any) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  constructor(htmlStream: MediaStream, participant: Participant) {
    this.htmlStream = htmlStream;
    this.participant = participant;
  }

  attach(rawElement: ?HTMLVideoElement) {
    const element = rawElement || document.createElement('video');
    const isLocal = this.participant instanceof Wazo.LocalParticipant;
    element.autoplay = true;
    element.srcObject = this.htmlStream;
    element.muted = isLocal;

    if (isLocal) {
      // Reverse local video
      element.style.transform = 'scale(-1, 1)';
    }

    element.onloadedmetadata = () => {
      const tracks = this.htmlStream ? this.htmlStream.getVideoTracks() : [];
      tracks.forEach(track => {
        // Do not re-enable the track if already mounted.
        if (!track.loaded) {
          track.enabled = true;
        }
        // $FlowFixMe
        track.loaded = true;
      });
    };

    return element;
  }

  detach() {
    Stream.detachStream(this.htmlStream);
  }

  hasVideo() {
    if (!this.htmlStream) {
      return false;
    }

    return this.htmlStream.getTracks().find(track => track.kind === 'video' && track.readyState !== 'ended');
  }

  get id() {
    return this.htmlStream ? this.htmlStream.id : null;
  }
}

export default Stream;
