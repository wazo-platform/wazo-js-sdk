/* global navigator */
import Wazo from './index';

const createLocalStream = async (kind: string, options: Record<string, any> = {}) => {
  const createOptions: Record<string, any> = {};
  createOptions[kind] = Object.keys(options).length > 0 ? options : true;
  const mediaStream = await navigator.mediaDevices.getUserMedia(createOptions);
  return new Wazo.Stream(mediaStream, new Wazo.LocalParticipant(null, { call_id: 'some-call-id', caller_id_name: 'some-call-id-name' }));
};

export const createLocalVideoStream = async (options: Record<string, any>) => createLocalStream('video', options);
export const createLocalAudioStream = async (options: Record<string, any>) => createLocalStream('audio', options);
