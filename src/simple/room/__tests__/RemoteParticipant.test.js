// Using directly Wazo to avoid issues with require cycle
import Wazo from '../../index';

describe('RemoteParticipant', () => {
  it('should fall back on number when name is <unknown>', () => {
    const number = '1234';
    const participant = new Wazo.RemoteParticipant(null, { caller_id_name: '<unknown>', caller_id_number: number });
    expect(participant.name).toEqual(number);
  });
});
