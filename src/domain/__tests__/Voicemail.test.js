// @flow

import Voicemail from '../Voicemail';

describe('Voicemail', () => {
  it('is the same voicemail given the same id', () => {
    const voicemail = new Voicemail({ id: 'ref-abc' });
    const anotherVoicemail = new Voicemail({ id: 'ref-abc' });

    expect(voicemail.is(anotherVoicemail)).toBeTruthy();
  });

  it('is not the same voicemail given different ids', () => {
    const voicemail = new Voicemail({ id: 'ref-abc' });
    const anotherVoicemail = new Voicemail({ id: 'ref-123' });

    expect(voicemail.is(anotherVoicemail)).toBeFalsy();
  });

  it("matches when the query includes the caller's name", () => {
    const voicemail = new Voicemail({
      caller: {
        name: 'john doe',
        number: '0101010101'
      }
    });
    const query = 'john';

    expect(voicemail.contains(query)).toBeTruthy();
  });

  it("matches when the query includes the uppercased caller's name", () => {
    const voicemail = new Voicemail({
      caller: {
        name: 'John Doe',
        number: '0101010101'
      }
    });
    const query = 'jOHn';

    expect(voicemail.contains(query)).toBeTruthy();
  });

  it("matches when the query includes the caller's number", () => {
    const voicemail = new Voicemail({
      caller: {
        name: 'john doe',
        number: '0101010101'
      }
    });
    const query = '010101';

    expect(voicemail.contains(query)).toBeTruthy();
  });
});
