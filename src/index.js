import ApiClient from './api-client';
import WebRTCClient from './web-rtc-client';
import WebSocketClient from './websocket-client';

import BadResponse from './domain/BadResponse';

export default {
  WazoApiClient: ApiClient,
  WazoWebRTCClient: WebRTCClient,
  WazoWebSocketClient: WebSocketClient,
  BadResponse
};
