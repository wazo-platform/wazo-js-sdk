import CallSession from '../CallSession';

import Room from '../Room';

describe('Room', () => {
  describe('on get extension', () => {
    describe('given a connected call', () => {
      it('should return the number of the cal', async () => {
        const number = 'some-number';
        const room = new Room({ id: 'some-id', connectedCallSession: new CallSession({ number }), participants: [] });

        const extension = room.getExtension();

        expect(extension).toEqual(number);
      });
    });

    describe('given NO connected call', () => {
      it('should return nothing', async () => {
        const room = new Room({ id: 'some-id', connectedCallSession: null, participants: [] });

        const extension = room.getExtension();

        expect(extension).toBeNull();
      });
    });
  });

  describe('on connect call', () => {
    it('should add call to room', async () => {
      const room = new Room({ id: 'some-id' });
      const callSession = new CallSession({ callId: 'some-call-id' });

      const connectedRoom = room.connect(callSession);

      expect(connectedRoom.connectedCallSession).toBe(callSession);
    });
  });

  describe('on room has call', () => {
    describe('given no connected call', () => {
      it('should be false', async () => {
        const room = new Room({ connectedCallSession: null });
        const callSession = new CallSession({});

        const roomHasCall = room.has(callSession);

        expect(roomHasCall).toBeFalsy();
      });
    });

    describe('given a connected call', () => {
      it('should be true if same calls', async () => {
        const callSession = new CallSession({ callId: 'some-call-id' });
        const room = new Room({ connectedCallSession: callSession });

        const roomHasCall = room.has(callSession);

        expect(roomHasCall).toBeTruthy();
      });

      it('should be false if different calls', async () => {
        const call1 = new CallSession({ callId: 'some-call-id' });
        const call2 = new CallSession({ callId: 'some-other-call-id' });
        const room = new Room({ connectedCallSession: call1 });

        const roomHasCall = room.has(call2);

        expect(roomHasCall).toBeFalsy();
      });
    });
  });

  describe('on add participant', () => {
    it('should add participant to room', async () => {
      const participants = [{}];
      const room = new Room({ connectedCallSession: null, participants });

      const participantUuid = 'some-uuid';
      const participantExtension = 'some-extension';
      const updatedRoom = room.addParticipant(participantUuid, participantExtension);

      expect(updatedRoom.participants[1].uuid).toEqual(participantUuid);
      expect(updatedRoom.participants[1].extension).toEqual(participantExtension);
    });
  });

  describe('on room has call with id', () => {
    describe('given no connected call', () => {
      it('should be false', async () => {
        const room = new Room({ connectedCallSession: null });
        const callId = 'some-call-id';

        const roomHasCall = room.hasCallWithId(callId);

        expect(roomHasCall).toBeFalsy();
      });
    });

    describe('given a connected call', () => {
      it('should be true if same calls', async () => {
        const callId = 'some-call-id';
        const room = new Room({ connectedCallSession: new CallSession({ callId }) });

        const roomHasCall = room.hasCallWithId(callId);

        expect(roomHasCall).toBeTruthy();
      });

      it('should be false if different calls', async () => {
        const callId = 'some-call-id';
        const room = new Room({ connectedCallSession: new CallSession({ callId: 'some-other-call-id' }) });

        const roomHasCall = room.hasCallWithId(callId);

        expect(roomHasCall).toBeFalsy();
      });
    });
  });

  describe('on disconnect', () => {
    it('should destroy connected call', async () => {
      const room = new Room({ connectedCallSession: new CallSession({}) });

      expect(room.connectedCallSession).not.toBeNull();

      const updatedRoom = room.disconnect();

      expect(updatedRoom.connectedCallSession).toBeNull();
    });
  });

  describe('on remove participant with UUID', () => {
    it('should remove participant with corresponding UUID', async () => {
      const uuid = 'some-uuid';
      const room = new Room({ participants: [{ uuid }] });

      expect(room.participants.some(participant => participant.uuid === uuid)).toBeTruthy();

      const updatedRoom = room.removeParticipantWithUUID(uuid);

      expect(updatedRoom.participants.some(participant => participant.uuid === uuid)).toBeFalsy();
    });
  });

  describe('on remove participant with extension', () => {
    it('should remove participant with corresponding UUID', async () => {
      const extension = 'some-extension';
      const room = new Room({ participants: [{ extension }] });

      expect(room.participants.some(participant => participant.extension === extension)).toBeTruthy();

      const updatedRoom = room.removeParticipantWithExtension(extension);

      expect(updatedRoom.participants.some(participant => participant.extension === extension)).toBeFalsy();
    });
  });
});
