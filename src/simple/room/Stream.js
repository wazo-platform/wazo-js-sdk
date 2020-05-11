/* global document */
// @flow
import type Participant from './Participant';
import Wazo from '../index';

class Stream {
  htmlStream: MediaStream;
  participant: Participant;

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
        // eslint-disable-next-line
        track.enabled = true;
      });
    };

    return element;
  }

  detach() {
    this.htmlStream.getTracks().forEach(track => {
      track.stop();
    });
  }

  get id() {
    return this.htmlStream.id;
  }
}

export default Stream;
