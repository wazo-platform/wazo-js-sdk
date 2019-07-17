import CallSession from '../CallSession';
import Conference from '../Conference';

const createConference = moreArguments => {
  const STUB_PHONE = {
    startConference: jest.fn(),
    addToConference: jest.fn(),
    muteConference: jest.fn(),
    unmuteConference: jest.fn(),
    holdConference: jest.fn(),
    resumeConference: jest.fn(),
    hangupConference: jest.fn(),
  };

  const defaultParams = {
    startTime: new Date(2018, 0, 1),
    participants: [],
    phone: STUB_PHONE,
  };

  return new Conference({
    ...defaultParams,
    ...moreArguments,
  });
};

describe('Conference', () => {
  describe('When creating a new conference', () => {
    it('expect conference to be started', () => {
      const conference = createConference({});

      expect(conference.started).toBeTruthy();
    });

    it('expect phone to start conference', () => {
      const conference = createConference({});

      expect(conference.phone.startConference).toBeCalled();
    });

    describe('and the started parameter', () => {
      describe('is received', () => {
        it('expect conference to be started givin the started parameter is true', () => {
          const conference = createConference({
            started: true,
          });

          expect(conference.started).toBeTruthy();
        });
        it('expect conference to be started givin the started parameter is false', () => {
          const conference = createConference({
            started: false,
          });

          expect(conference.started).toBeTruthy();
        });
      });
      describe('is missing', () => {
        it('expect conference to be started', () => {
          const conference = createConference({});

          expect(conference.started).toBeTruthy();
        });
      });
    });

    describe('and the finished parameter', () => {
      describe('is received', () => {
        it('expect conference to be finished givin the finished parameter is true', () => {
          const conference = createConference({
            finished: true,
          });

          expect(conference.finished).toBeTruthy();
        });
        it('expect conference not to be finished givin the finished parameter is false', () => {
          const conference = createConference({
            finished: false,
          });

          expect(conference.finished).toBeFalsy();
        });
      });
      describe('is missing', () => {
        it('expect conference not to be finished', () => {
          const conference = createConference({});

          expect(conference.finished).toBeFalsy();
        });
      });
    });
  });

  describe('When getting the participants', () => {
    it('should retrieve an empty list given conference has none', () => {
      const conference = createConference({});

      expect(conference.getParticipants()).toEqual([]);
    });

    it('should retrieve all of them given conference has many', () => {
      const CALLSESSION_1 = new CallSession({
        id: 1,
      });
      const CALLSESSION_2 = new CallSession({
        id: 2,
      });

      const conference = createConference({
        participants: [CALLSESSION_1, CALLSESSION_2],
      });

      expect(conference.getParticipants()).toEqual([CALLSESSION_1, CALLSESSION_2]);
    });
  });

  describe('When checking if conference has participants', () => {
    it('should be true given conference has particpants', () => {
      const CALLSESSION_1 = new CallSession({
        id: 1,
      });
      const CALLSESSION_2 = new CallSession({
        id: 2,
      });

      const conference = createConference({
        participants: [CALLSESSION_1, CALLSESSION_2],
      });

      expect(conference.hasParticipants()).toBeTruthy();
    });

    it('should be false given conference has no particpants', () => {
      const conference = createConference({
        participants: [],
      });

      expect(conference.hasParticipants()).toBeFalsy();
    });
  });

  describe('When a participant has left the conference', () => {
    it('should remove it from the participants', () => {
      const EXISTING_PARTICIPANT = new CallSession({
        id: '123',
      });
      const conference = createConference({
        started: true,
        participants: [EXISTING_PARTICIPANT],
      });

      const updatedConference = conference.participantHasLeft(EXISTING_PARTICIPANT);

      expect(updatedConference.participants).toEqual([]);
    });
  });

  describe('When adding participants', () => {
    it('should pass the new participants to the phone', async () => {
      const NEW_PARTICIPANT = new CallSession({});
      const conference = createConference({});

      await conference.addParticipants([NEW_PARTICIPANT]);

      expect(conference.phone.addToConference).toBeCalledWith([NEW_PARTICIPANT]);
    });

    it('should add every participants to the conference', async () => {
      const NEW_PARTICIPANT_1 = new CallSession({});
      const NEW_PARTICIPANT_2 = new CallSession({});
      const conference = createConference({});

      const updatedConference = await conference.addParticipants([NEW_PARTICIPANT_1, NEW_PARTICIPANT_2]);

      expect(updatedConference.participants).toEqual([NEW_PARTICIPANT_1, NEW_PARTICIPANT_2]);
    });

    describe('and conference is muted', () => {
      it('expect phone to mute new participants', async () => {
        const OLD_PARTICIPANT = new CallSession({});
        OLD_PARTICIPANT.isMuted = () => true;
        const NEW_PARTICIPANT = new CallSession({});
        const conference = createConference({
          participants: [OLD_PARTICIPANT],
        });

        await conference.addParticipants([NEW_PARTICIPANT]);

        expect(conference.phone.muteConference).toBeCalledWith([NEW_PARTICIPANT]);
      });
    });

    describe('and conference is not muted', () => {
      it('expect phone to unmute new participants', async () => {
        const OLD_PARTICIPANT = new CallSession({});
        OLD_PARTICIPANT.isMuted = () => false;
        const NEW_PARTICIPANT = new CallSession({});
        const conference = createConference({
          participants: [OLD_PARTICIPANT],
        });

        await conference.addParticipants([NEW_PARTICIPANT]);

        expect(conference.phone.unmuteConference).toBeCalledWith([NEW_PARTICIPANT]);
      });
    });

    describe('and conference is held', () => {
      it('expect phone to resume old and new participants', async () => {
        const OLD_PARTICIPANT = new CallSession({});
        OLD_PARTICIPANT.isOnHold = () => true;
        const NEW_PARTICIPANT = new CallSession({});
        const conference = createConference({
          participants: [OLD_PARTICIPANT],
        });

        await conference.addParticipants([NEW_PARTICIPANT]);

        expect(conference.phone.resumeConference).toBeCalledWith([OLD_PARTICIPANT, NEW_PARTICIPANT]);
      });
    });

    describe('and conference is not held', () => {
      it('expect phone to resume old and new participants', async () => {
        const OLD_PARTICIPANT = new CallSession({});
        OLD_PARTICIPANT.isOnHold = () => false;
        const NEW_PARTICIPANT = new CallSession({});
        const conference = createConference({
          participants: [OLD_PARTICIPANT],
        });

        await conference.addParticipants([NEW_PARTICIPANT]);

        expect(conference.phone.resumeConference).toBeCalledWith([OLD_PARTICIPANT, NEW_PARTICIPANT]);
      });
    });
  });

  describe('When muting conference', () => {
    it('expect phone to mute conference', () => {
      const PARTICIPANT = new CallSession({});
      const conference = createConference({
        participants: [PARTICIPANT],
      });

      conference.mute();

      expect(conference.phone.muteConference).toBeCalledWith([PARTICIPANT]);
    });
  });

  describe('When unmuting conference', () => {
    it('expect phone to unmute conference', () => {
      const PARTICIPANT = new CallSession({});
      const conference = createConference({
        participants: [PARTICIPANT],
      });

      conference.unmute();

      expect(conference.phone.unmuteConference).toBeCalledWith([PARTICIPANT]);
    });
  });

  describe('When holding conference', () => {
    it('expect phone to hold conference', () => {
      const PARTICIPANT = new CallSession({});
      const conference = createConference({
        participants: [PARTICIPANT],
      });

      conference.hold();

      expect(conference.phone.holdConference).toBeCalledWith([PARTICIPANT]);
    });
  });

  describe('When resuming conference', () => {
    it('expect phone to resume conference', () => {
      const PARTICIPANT = new CallSession({});
      const conference = createConference({
        participants: [PARTICIPANT],
      });

      conference.resume();

      expect(conference.phone.resumeConference).toBeCalledWith([PARTICIPANT]);
    });
  });

  describe('When hanging up conference', () => {
    it('expect phone to hangup conference', () => {
      const PARTICIPANT = new CallSession({});
      const conference = createConference({
        participants: [PARTICIPANT],
        finished: false,
      });

      conference.hangup();

      expect(conference.phone.hangupConference).toBeCalledWith([PARTICIPANT]);
    });
    it('expect new conference reference to be finished', () => {
      const PARTICIPANT = new CallSession({});
      const conference = createConference({
        participants: [PARTICIPANT],
        finished: false,
      });

      const updatedConference = conference.hangup();

      expect(updatedConference.finished).toBeTruthy();
    });
  });

  describe('When checking if conference is held', () => {
    it('should return true if all participants are held', () => {
      const PARTICIPANT_A = {
        isOnHold: () => true,
      };
      const PARTICIPANT_B = {
        isOnHold: () => true,
      };
      const conference = createConference({
        participants: [PARTICIPANT_A, PARTICIPANT_B],
        started: true,
      });

      expect(conference.isOnHold()).toBeTruthy();
    });
    it('should return false if one participant is not held', () => {
      const PARTICIPANT_A = {
        isOnHold: () => true,
      };
      const PARTICIPANT_B = {
        isOnHold: () => false,
      };
      const conference = createConference({
        participants: [PARTICIPANT_A, PARTICIPANT_B],
        started: true,
      });

      expect(conference.isOnHold()).toBeFalsy();
    });
  });

  describe('When checking if conference is mute', () => {
    it('should return true if all participants are muted', () => {
      const PARTICIPANT_A = {
        isMuted: () => true,
      };
      const PARTICIPANT_B = {
        isMuted: () => true,
      };
      const conference = createConference({
        participants: [PARTICIPANT_A, PARTICIPANT_B],
        started: true,
      });

      expect(conference.isMuted()).toBeTruthy();
    });
    it('should return false if one participant is not muted', () => {
      const PARTICIPANT_A = {
        isMuted: () => true,
      };
      const PARTICIPANT_B = {
        isMuted: () => false,
      };
      const conference = createConference({
        participants: [PARTICIPANT_A, PARTICIPANT_B],
        started: true,
      });

      expect(conference.isMuted()).toBeFalsy();
    });
  });
});
