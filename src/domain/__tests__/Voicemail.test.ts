import Voicemail, { VoicemailBox } from '../Voicemail';

const defaultCaller = {
  name: 'john doe',
  number: '0101010101',
};

const defaultMailbox: VoicemailBox = {
  id: '123',
  name: 'Main Mailbox',
  type: 'user',
};
describe('Voicemail', () => {
  it('is the same voicemail given the same id', () => {
    const voicemail = new Voicemail({
      id: 'ref-abc',
      caller: defaultCaller,
      date: new Date(),
      duration: 0,
    });
    const anotherVoicemail = new Voicemail({
      id: 'ref-abc',
      caller: defaultCaller,
      date: new Date(),
      duration: 0,
    });
    expect(voicemail.is(anotherVoicemail)).toBeTruthy();
  });
  it('is not the same voicemail given different ids', () => {
    const voicemail = new Voicemail({
      id: 'ref-abc',
      caller: defaultCaller,
      date: new Date(),
      duration: 0,
    });
    const anotherVoicemail = new Voicemail({
      id: 'ref-123',
      caller: defaultCaller,
      date: new Date(),
      duration: 0,
    });
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
  it('can be created with a mailbox', () => {
    const voicemail = new Voicemail({
      id: 'ref-abc',
      caller: defaultCaller,
      date: new Date(),
      duration: 0,
      mailbox: defaultMailbox,
    });
    expect(voicemail.mailbox).toEqual(defaultMailbox);
  });

  it('can be created without a mailbox', () => {
    const voicemail = new Voicemail({
      id: 'ref-abc',
      caller: defaultCaller,
      date: new Date(),
      duration: 0,
    });
    expect(voicemail.mailbox).toBeUndefined();
  });

  describe('when parsing', () => {
    it('can convert the date to unix timestamp', () => {
      const raw = {
        duration: 5,
        timestamp: 1530823017,
        // Thu Jul 05 2018 16:36:57 GMT-0400 (GMT-04:00)
        id: '1530823017-00000000',
        caller_id_name: 'Cl\u00e9ment Bourgeois',
        caller_id_num: '8005',
      };
      const voicemail = Voicemail.parse(raw);
      expect(voicemail.date.toISOString()).toBe('2018-07-05T20:36:57.000Z');
    });

    it('can parse voicemail with mailbox information', () => {
      const raw = {
        duration: 5,
        timestamp: 1530823017,
        id: '1530823017-00000000',
        caller_id_name: 'Cl\u00e9ment Bourgeois',
        caller_id_num: '8005',
        voicemail: defaultMailbox,
      };
      const voicemail = Voicemail.parse(raw);
      expect(voicemail.mailbox).toEqual(defaultMailbox);
    });

    it('can parse voicemail without mailbox information', () => {
      const raw = {
        duration: 5,
        timestamp: 1530823017,
        id: '1530823017-00000000',
        caller_id_name: 'Cl\u00e9ment Bourgeois',
        caller_id_num: '8005',
      };
      const voicemail = Voicemail.parse(raw);
      expect(voicemail.mailbox).toBeUndefined();
    });
  });

  describe('parseListData', () => {
    it('returns empty array when plain is null or undefined', () => {
      expect(Voicemail.parseListData(null as any)).toEqual([]);
      expect(Voicemail.parseListData(undefined as any)).toEqual([]);
      expect(Voicemail.parseListData({} as any)).toEqual([]);
    });

    it('filters out invalid items and parses valid ones', () => {
      const listData = {
        items: [
          {
            id: 'vm-1',
            duration: 30,
            timestamp: 1530823017,
            caller_id_name: 'John Doe',
            caller_id_num: '1234567890',
            voicemail: {
              id: 123,
              name: 'Main Mailbox',
              type: 'user' as const,
            },
          },
          {
            id: 'vm-2',
            duration: 45,
            timestamp: 1530823018,
            caller_id_name: 'Jane Smith',
            caller_id_num: '0987654321',
          },
        ],
      };

      const voicemails = Voicemail.parseListData(listData as any);
      expect(voicemails).toHaveLength(2);
      expect(voicemails[0].id).toBe('vm-1');
      expect(voicemails[0].mailbox).toEqual({
        id: '123',
        name: 'Main Mailbox',
        type: 'user',
      });
      expect(voicemails[1].id).toBe('vm-2');
      expect(voicemails[1].mailbox).toBeUndefined();
    });

    it('handles missing optional fields gracefully', () => {
      const listData = {
        items: [
          {
            id: 'vm-1',
            duration: 30,
            timestamp: 1530823017,
            // caller_id_name and caller_id_num are missing
            voicemail: {
              id: 456,
              // name and type are missing
            },
          },
        ],
      };

      const voicemails = Voicemail.parseListData(listData as any);
      expect(voicemails).toHaveLength(1);
      expect(voicemails[0].caller.name).toBe('');
      expect(voicemails[0].caller.number).toBe('');
      expect(voicemails[0].mailbox).toEqual({
        id: '456',
        name: '',
        type: '',
      });
    });
  });
});
