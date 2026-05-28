import CallSession from '../CallSession';
import IndirectTransfer from '../IndirectTransfer';

describe('Indirect transfer', () => {
  describe('on parse from call session', () => {
    it('should return valid IndirectTransfer', async () => {
      const sourceId = 'source-id';
      const destinationId = 'destination-id';
      const indirectTransfer = IndirectTransfer.parseFromCallSession(new CallSession({
        callId: sourceId,
      } as any), new CallSession({
        callId: destinationId,
      } as any));
      expect(indirectTransfer).toEqual({
        sourceId,
        destinationId,
      });
    });
  });
  describe('on check destination', () => {
    it('should match when destination is the same', async () => {
      const destinationId = 'destination-id';
      const indirectTransfer = new IndirectTransfer({
        sourceId: 'some-id',
        destinationId,
      });
      const isDestination = indirectTransfer.destinationIs(new CallSession({
        callId: destinationId,
      } as any));
      expect(isDestination).toBeTruthy();
    });
    it('should NOT match when destination is the different', async () => {
      const destinationId = 'destination-id';
      const indirectTransfer = new IndirectTransfer({
        sourceId: 'some-id',
        destinationId: 'some-other-id',
      });
      const isDestination = indirectTransfer.destinationIs(new CallSession({
        callId: destinationId,
      } as any));
      expect(isDestination).toBeFalsy();
    });
  });
  describe('on check source', () => {
    it('should match when source is the same', async () => {
      const sourceId = 'source-id';
      const indirectTransfer = new IndirectTransfer({
        destinationId: 'some-id',
        sourceId,
      });
      const isSource = indirectTransfer.sourceIs(new CallSession({
        callId: sourceId,
      } as any));
      expect(isSource).toBeTruthy();
    });
    it('should NOT match when source is the different', async () => {
      const sourceId = 'source-id';
      const indirectTransfer = new IndirectTransfer({
        sourceId: 'some-id',
        destinationId: 'some-other-id',
      });
      const isSource = indirectTransfer.sourceIs(new CallSession({
        callId: sourceId,
      } as any));
      expect(isSource).toBeFalsy();
    });
  });

  // IndirectTransfer's fields are all scalars (string IDs + status). The
  // `update_from`/`new_from` helpers iterate keys once and copy references; they
  // cannot loop on this shape. The tests below lock that contract in so any
  // future field addition that breaks it (e.g. an object reference back to a
  // CallSession) is caught here rather than at runtime in production.
  describe('updateFrom and newFrom safety', () => {
    it('updateFrom copies scalar fields from another IndirectTransfer', () => {
      const a = new IndirectTransfer({ sourceId: 's-1', destinationId: 'd-1', status: 'starting' });
      const b = new IndirectTransfer({ sourceId: 's-2', destinationId: 'd-2', status: 'answered', id: 'tr-1' });
      a.updateFrom(b);
      expect(a.sourceId).toBe('s-2');
      expect(a.destinationId).toBe('d-2');
      expect(a.status).toBe('answered');
      expect(a.id).toBe('tr-1');
    });

    it('newFrom returns a new instance with the same scalar fields', () => {
      const original = new IndirectTransfer({ sourceId: 's-1', destinationId: 'd-1', status: 'starting', id: 'tr-1' });
      const copy = IndirectTransfer.newFrom(original);
      expect(copy).not.toBe(original);
      expect(copy).toEqual(original);
    });

    it('JSON.stringify of an IndirectTransfer round-trips cleanly', () => {
      const transfer = new IndirectTransfer({ sourceId: 's-1', destinationId: 'd-1', status: 'starting', id: 'tr-1' });
      expect(() => JSON.stringify(transfer)).not.toThrow();
      // All fields are scalars: spreading the instance is equivalent to the
      // JSON round-trip shape for plain-data classes like this one.
      expect({ ...transfer }).toEqual({
        sourceId: 's-1',
        destinationId: 'd-1',
        status: 'starting',
        id: 'tr-1',
      });
    });
  });
});
