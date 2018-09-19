import ReconnectingWebSocket from 'reconnecting-websocket';

export default class WebSocketClient {
  constructor(params) {
    this.ws_init = false;
    this.callback = params.callback;
    this.host = params.host;
    this.token = params.token;
    this.events = params.events;
  }

  init() {
    const sock = new ReconnectingWebSocket(`wss://${this.host}/api/websocketd/?token=${this.token}`);
    sock.debug = false;

    sock.onmessage = e => {
      const ev = JSON.parse(e.data);

      if (!this.ws_init) {
        this.initialize(ev, sock);
      } else {
        this.callback(ev);
      }
    };

    sock.onclose = e => {
      switch (e.code) {
        case 4002:
          break;
        case 4003:
          break;
        default:
      }
    };

    return sock;
  }

  initialize(data, sock) {
    switch (data.op) {
      case 'init':
        this.events.forEach(event => {
          const op = {
            op: 'subscribe',
            data: { event_name: event }
          };

          sock.send(JSON.stringify(op));
        });

        sock.send(JSON.stringify({ op: 'start' }));
        break;
      case 'subscribe':
        break;
      case 'start':
        this.ws_init = true;
        break;
      default:
      // nothing
    }
  }
}
