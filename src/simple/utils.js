/* global navigator */
import Wazo from './index';

const createLocalStream = async (kind: string, options: Object = {}) => {
  const createOptions = {};
  createOptions[kind] = Object.keys(options).length > 0 ? options : true;

  // $FlowFixMe
  const mediaStream = await navigator.mediaDevices.getUserMedia(createOptions);

  return new Wazo.Stream(mediaStream, new Wazo.LocalParticipant());
};

export const createLocalVideoStream = async (options: Object) => createLocalStream('video', options);

export const createLocalAudioStream = async (options: Object) => createLocalStream('audio', options);
