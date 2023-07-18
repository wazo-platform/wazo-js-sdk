/* global MediaStream */
import WebRTCClient from '../../web-rtc-client';

export default {
  name: 'WebRTC',
  check: (server: string, session: any) => new Promise<void | string>((resolve, reject) => {
    if (typeof MediaStream === 'undefined') {
      return resolve('Skipped on node');
    }

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
      const sipSession = client.call('*10');

      if (!sipSession || !client.getSipSessionId(sipSession)) {
        return handleError('Unable to make call through WebRTC');
      }

      setTimeout(() => {
        client.hangup(sipSession);
        handleSuccess();
      }, 1000);
    });
  }),
};
