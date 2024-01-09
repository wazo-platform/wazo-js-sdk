// Using directly Wazo to avoid issues with require cycle
import Wazo from '../../index';
import { RawParticipant } from '../Participant';
import Room from '../Room';

describe('RemoteParticipant', () => {
  it('should fall back on number when name is <unknown>', () => {
    const number = '1234';
    const participant = new Wazo.RemoteParticipant({} as Room, {
      caller_id_name: '<unknown>',
      caller_id_number: number,
    } as RawParticipant);
    expect(participant.name).toEqual(number);
  });
});
