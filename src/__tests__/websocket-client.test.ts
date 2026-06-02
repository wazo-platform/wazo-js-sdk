import WebSocketClient from '../websocket-client';

jest.mock('reconnecting-websocket', () => {
  const instances: any[] = [];
  class MockReconnectingWebSocket {
    close = jest.fn();

    reconnect = jest.fn();

    send = jest.fn();

    binaryType = '';

    onopen: any = null;

    onmessage: any = null;

    onerror: any = null;

    onclose: any = null;

    readyState = 1;

    OPEN = 1;

    constructor() {
      instances.push(this);
    }
  }

  return {
    __esModule: true,
    default: MockReconnectingWebSocket,
    instances,
  };
});

const { instances } = jest.requireMock('reconnecting-websocket') as { instances: any[] };

const makeClient = (singleConnection: boolean) =>
  new WebSocketClient({
    host: 'localhost',
    token: 'token',
    version: 2,
    events: [],
  }, {
    singleConnection,
  });

describe('WebSocketClient single-connection', () => {
  beforeEach(() => {
    instances.length = 0;
  });

  it('detaches handlers and closes the previous socket before reconnecting when enabled', () => {
    const client = makeClient(true);
    client.connect();
    const previous = instances[0];

    client.connect();

    expect(previous.close).toHaveBeenCalled();
    expect(previous.onmessage).toBeNull();
    expect(previous.onopen).toBeNull();
    expect(previous.onerror).toBeNull();
    expect(previous.onclose).toBeNull();
    expect(instances).toHaveLength(2);
    expect(client.socket).toBe(instances[1]);
  });

  it('keeps the previous socket untouched when disabled (default behavior)', () => {
    const client = makeClient(false);
    client.connect();
    const previous = instances[0];

    client.connect();

    expect(previous.close).not.toHaveBeenCalled();
    expect(instances).toHaveLength(2);
  });
});

describe('WebSocketClient close', () => {
  beforeEach(() => {
    instances.length = 0;
  });

  it('detaches inner socket handlers on force close', () => {
    const client = makeClient(true);
    client.connect();
    const socket = instances[0];

    client.close(true);

    expect(socket.close).toHaveBeenCalledWith(1000);
    expect(socket.onmessage).toBeNull();
    expect(socket.onopen).toBeNull();
    expect(socket.onerror).toBeNull();
    expect(socket.onclose).toBeNull();
    expect(client.socket).toBeNull();
  });

  it('leaves inner socket handlers attached on non-force close', () => {
    const client = makeClient(true);
    client.connect();
    const socket = instances[0];

    client.close();

    expect(socket.close).toHaveBeenCalledWith(1000);
    expect(socket.onmessage).not.toBeNull();
  });
});
