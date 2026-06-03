import { Websocket } from '../Websocket';

jest.mock('../../websocket-client', () => {
  const actual = jest.requireActual('../../websocket-client');
  const instances: any[] = [];

  class MockWazoWebSocketClient {
    static readonly eventLists = actual.default.eventLists;

    close = jest.fn();

    connect = jest.fn();

    on = jest.fn();

    updateToken = jest.fn();

    isConnected = jest.fn();

    constructor() {
      instances.push(this);
    }
  }

  return {
    ...actual,
    __esModule: true,
    default: MockWazoWebSocketClient,
    instances,
  };
});

const { instances } = jest.requireMock('../../websocket-client') as { instances: any[] };

const session = { token: 'token', uuid: 'uuid' } as any;

describe('simple Websocket single-connection', () => {
  beforeEach(() => {
    instances.length = 0;
  });

  it('closes the previous client with force before reassigning on a second open()', () => {
    const ws = new Websocket();
    ws.enableSingleConnection();

    ws.open('localhost', session);
    const previous = instances[0];

    ws.open('localhost', session);

    expect(previous.close).toHaveBeenCalledWith(true);
    expect(instances).toHaveLength(2);
    expect(ws.ws).toBe(instances[1]);
  });

  it('does not close the previous client when single-connection is disabled', () => {
    const ws = new Websocket();

    ws.open('localhost', session);
    const previous = instances[0];

    ws.open('localhost', session);

    expect(previous.close).not.toHaveBeenCalled();
    expect(instances).toHaveLength(2);
  });
});
