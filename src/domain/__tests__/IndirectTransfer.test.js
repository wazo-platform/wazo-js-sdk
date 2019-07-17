import CallSession from '../CallSession';
import IndirectTransfer from '../IndirectTransfer';

describe('Indirect transfer', () => {
  describe('on parse from call session', () => {
    it('should return valid IndirectTransfer', async () => {
      const sourceId = 'source-id';
      const destinationId = 'destination-id';

      const indirectTransfer = IndirectTransfer.parseFromCallSession(
        new CallSession({ callId: sourceId }),
        new CallSession({ callId: destinationId }),
      );

      expect(indirectTransfer).toEqual({ sourceId, destinationId });
    });
  });

  describe('on check destination', () => {
    it('should match when destination is the same', async () => {
      const destinationId = 'destination-id';

      const indirectTransfer = new IndirectTransfer({ sourceId: 'some-id', destinationId });

      const isDestination = indirectTransfer.destinationIs(new CallSession({ callId: destinationId }));

      expect(isDestination).toBeTruthy();
    });

    it('should NOT match when destination is the different', async () => {
      const destinationId = 'destination-id';

      const indirectTransfer = new IndirectTransfer({ sourceId: 'some-id', destinationId: 'some-other-id' });

      const isDestination = indirectTransfer.destinationIs(new CallSession({ callId: destinationId }));

      expect(isDestination).toBeFalsy();
    });
  });

  describe('on check source', () => {
    it('should match when source is the same', async () => {
      const sourceId = 'source-id';

      const indirectTransfer = new IndirectTransfer({ destinationId: 'some-id', sourceId });

      const isSource = indirectTransfer.sourceIs(new CallSession({ callId: sourceId }));

      expect(isSource).toBeTruthy();
    });

    it('should NOT match when source is the different', async () => {
      const sourceId = 'source-id';

      const indirectTransfer = new IndirectTransfer({ sourceId: 'some-id', destinationId: 'some-other-id' });

      const isSource = indirectTransfer.sourceIs(new CallSession({ callId: sourceId }));

      expect(isSource).toBeFalsy();
    });
  });
});
