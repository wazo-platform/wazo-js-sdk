import WebSocketClient, { SOCKET_EVENTS, HEARTBEAT_ENGINE_VERSION } from '../../websocket-client';

export default {
  name: 'Wazo Websocket',
  check: (server, session) => new Promise((resolve, reject) => {
    const client = new WebSocketClient({
      host: server,
      token: session.token,
      version: 2,
    });

    const handleError = message => {
      client.close();
      reject(new Error(message));
    };

    const handleSuccess = () => {
      client.stopHeartbeat();
      client.close();
      resolve();
    };

    client.on(SOCKET_EVENTS.ON_ERROR, error => {
      handleError(`Connection error : ${error}`);
    });
    client.on(SOCKET_EVENTS.ON_OPEN, () => {
      if (session.hasEngineVersionGte(HEARTBEAT_ENGINE_VERSION)) {
        client.setOnHeartbeatTimeout(() => {
          handleError('No response to heartbeat');
        });
        client.setOnHeartbeatCallback(() => {
          handleSuccess();
        });
        client.startHeartbeat();
      } else {
        handleSuccess();
      }
    });
    client.connect();
  }),
};
