// Using directly Wazo to avoid issues with require cycle
import getApiClient from '../../../service/getApiClient';
import Wazo from '../../index';
import Room from '../Room';

jest.mock('../../../service/getApiClient');

describe('Participant', () => {
  describe('ban', () => {
    it('should throw an error when there is no meeting', async () => {
      // @ts-expect-error
      const room = new Room();
      const participant = new Wazo.RemoteParticipant(room, {
        call_id: 'id',
        caller_id_name: 'Alice',
        caller_id_number: 'number',
      });
      await expect(async () => participant.ban()).rejects.toThrow('Attempting to ban a participant without a `meetingUuid`');
    });
    it('should call the api', async () => {
      const number = '1234';
      const meetingUuid = 'some-meeting-uuid';
      const callId = 'some-call-id';
      // @ts-expect-error
      const room = new Room();
      room.setMeetingUuid(meetingUuid);
      const banMeetingParticipant = jest.fn();
      // @ts-expect-error
      getApiClient.mockImplementation(() => ({
        calld: {
          banMeetingParticipant,
        },
      }));
      const participant = new Wazo.RemoteParticipant(room, {
        call_id: callId,
        caller_id_name: 'Alice',
        caller_id_number: number,
      });
      participant.onBan = jest.fn();
      await participant.ban();
      expect(banMeetingParticipant).toHaveBeenCalledWith(meetingUuid, callId);
      expect(participant.onBan).toHaveBeenCalledWith(true);
    });
    it('should call the api with a delay', async () => {
      const number = '1234';
      const meetingUuid = 'some-meeting-uuid';
      const callId = 'some-call-id';
      const someDelay = 2;
      // @ts-expect-error
      const room = new Room();
      room.setMeetingUuid(meetingUuid);
      const banMeetingParticipant = jest.fn();
      // @ts-expect-error
      getApiClient.mockImplementation(() => ({
        calld: {
          banMeetingParticipant,
        },
      }));
      const participant = new Wazo.RemoteParticipant(room, {
        call_id: callId,
        caller_id_name: 'Alice',
        caller_id_number: number,
      });
      participant.delay = jest.fn();
      participant.onBan = jest.fn();
      await participant.ban(someDelay);
      expect(banMeetingParticipant).toHaveBeenCalledWith(meetingUuid, callId);
      expect(participant.delay).toHaveBeenCalledWith(someDelay);
      expect(participant.onBan).toHaveBeenCalledWith(true);
    });
  });
});
