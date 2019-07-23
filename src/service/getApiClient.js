/* @flow */

import WazoApiClient from '../api-client';

const clients = {};

export default (server: string): WazoApiClient => {
  if (server in clients) {
    return clients[server];
  }

  clients[server] = new WazoApiClient({ server });

  return clients[server];
};
