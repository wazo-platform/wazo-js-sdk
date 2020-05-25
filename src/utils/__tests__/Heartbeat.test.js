import Heartbeat from '../Heartbeat';

describe('Heartbeat', () => {
  describe('When onHearbeat is not called', () => {
    it('should retry the call with a new token', async () => {
      const spy = jest.fn();
      const heartbeat = new Heartbeat(10, 50, 2);
      heartbeat.setOnHeartbeatTimeout(spy);
      heartbeat.start();

      await new Promise(resolve => setTimeout(resolve, 70));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('When onHearbeat is called', () => {
    it('should not call onTimeout', async () => {
      const timeout = jest.fn();
      const sendHeartbeat = jest.fn();
      const heartbeat = new Heartbeat(10, 50, 2);
      heartbeat.setSendHeartbeat(sendHeartbeat);
      heartbeat.setOnHeartbeatTimeout(timeout);
      heartbeat.start();

      setTimeout(() => {
        heartbeat.onHeartbeat();
      }, 30);

      await new Promise(resolve => setTimeout(resolve, 70));

      expect(sendHeartbeat).toHaveBeenCalled();
      expect(timeout).not.toHaveBeenCalled();
    });
  });

  describe('When onHearbeat is called every times', () => {
    it('should call send', async () => {
      const timeout = jest.fn();
      const heartbeat = new Heartbeat(5, 50, 8);
      const sendHeartbeat = jest.fn(() => {
        heartbeat.onHeartbeat();
      });
      heartbeat.setSendHeartbeat(sendHeartbeat);
      heartbeat.setOnHeartbeatTimeout(timeout);
      heartbeat.start();

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(sendHeartbeat).toHaveBeenNthCalledWith(8);
      expect(timeout).not.toHaveBeenCalled();
    });
  });
});
