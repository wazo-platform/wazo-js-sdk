// @flow

import Voicemail from '../Voicemail';

const defaultCaller = {
  name: 'john doe',
  number: '0101010101',
};

describe('Voicemail', () => {
  it('is the same voicemail given the same id', () => {
    const voicemail = new Voicemail({ id: 'ref-abc', caller: defaultCaller, date: new Date(), duration: 0 });
    const anotherVoicemail = new Voicemail({ id: 'ref-abc', caller: defaultCaller, date: new Date(), duration: 0 });

    expect(voicemail.is(anotherVoicemail)).toBeTruthy();
  });

  it('is not the same voicemail given different ids', () => {
    const voicemail = new Voicemail({ id: 'ref-abc', caller: defaultCaller, date: new Date(), duration: 0 });
    const anotherVoicemail = new Voicemail({ id: 'ref-123', caller: defaultCaller, date: new Date(), duration: 0 });

    expect(voicemail.is(anotherVoicemail)).toBeFalsy();
  });

  it("matches when the query includes the caller's name", () => {
    const voicemail = new Voicemail({
      caller: {
        name: 'john doe',
        number: '0101010101',
      },
      date: new Date(),
      duration: 0,
      id: 'ref-1234',
    });
    const query = 'john';

    expect(voicemail.contains(query)).toBeTruthy();
  });

  it("matches when the query includes the uppercased caller's name", () => {
    const voicemail = new Voicemail({
      caller: {
        name: 'John Doe',
        number: '0101010101',
      },
      date: new Date(),
      duration: 0,
      id: 'ref-1234',
    });
    const query = 'jOHn';

    expect(voicemail.contains(query)).toBeTruthy();
  });

  it("matches when the query includes the caller's number", () => {
    const voicemail = new Voicemail({
      caller: {
        name: 'john doe',
        number: '0101010101',
      },
      date: new Date(),
      duration: 0,
      id: 'ref-1234',
    });
    const query = '010101';

    expect(voicemail.contains(query)).toBeTruthy();
  });

  describe('when parsing', () => {
    it('can convert the date to unix timestamp', () => {
      const raw = {
        duration: 5,
        timestamp: 1530823017, // Thu Jul 05 2018 16:36:57 GMT-0400 (GMT-04:00)
        id: '1530823017-00000000',
        caller_id_name: 'Cl\u00e9ment Bourgeois',
        caller_id_num: '8005',
      };

      const voicemail = Voicemail.parse(raw);

      expect(voicemail.date.toISOString()).toBe('2018-07-05T20:36:57.000Z');
    });
  });
});
