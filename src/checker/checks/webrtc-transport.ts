import { Invitation, Inviter } from 'sip.js';
import WebRTCClient from '../../web-rtc-client';

export default {
  name: 'WebRTC Transport (WS) ~30s',
  check: (server: string, session: Inviter | Invitation): Promise<void> => new Promise((resolve, reject) => {
    const [host, port = 443] = server.split(':');

    const client = new WebRTCClient({
      host,
      port,
      media: {
        audio: true,
      },
    }, session);

    const handleError = (message: any) => {
      client.close();
      reject(new Error(message));
    };

    const handleSuccess = async () => {
      client.stopHeartbeat();
      await client.close();
      resolve();
    };

    client.on(client.TRANSPORT_ERROR, error => {
      handleError(`Transport error : ${error}`);
    });

    client.on(client.REGISTERED, () => {
      client.setOnHeartbeatTimeout(() => {
        handleError('No response to heartbeat');
      });
      client.setOnHeartbeatCallback(() => {
        handleSuccess();
      });
      client.startHeartbeat();
    });
  }),
};
