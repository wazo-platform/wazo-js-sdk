/* global RTCSessionDescriptionInit */
// @flow
import EventEmitter from 'events';

import type { Logger } from 'sip.js/lib/core/log/logger';
import type { MediaStreamFactory } from 'sip.js/lib/platform/web/session-description-handler/media-stream-factory';
import type SessionDescriptionHandlerConfiguration
  from 'sip.js/lib/platform/web/session-description-handler/session-description-handler-configuration';

import { SessionDescriptionHandler } from 'sip.js/lib/platform/web/session-description-handler';

class WazoSessionDescriptionHandler extends SessionDescriptionHandler {
  constructor(
    logger: Logger,
    mediaStreamFactory: MediaStreamFactory,
    sessionDescriptionHandlerConfiguration?: SessionDescriptionHandlerConfiguration,
  ) {
    super(logger, mediaStreamFactory, sessionDescriptionHandlerConfiguration);

    this.eventEmitter = new EventEmitter();
  }

  on(event: string, callback: Function) {
    this.eventEmitter.on(event, callback);
  }

  off(event: string, callback: Function) {
    this.eventEmitter.removeListener(event, callback);
  }

  // $FlowFixMe
  setRemoteSessionDescription(sessionDescription: RTCSessionDescriptionInit): Promise<void> {
    const result = super.setRemoteSessionDescription(sessionDescription);

    this.eventEmitter.emit('setDescription', sessionDescription);

    return result;
  }
}

export default WazoSessionDescriptionHandler;
