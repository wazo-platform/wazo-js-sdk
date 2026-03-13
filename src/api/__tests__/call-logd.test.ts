import WazoApiClient from '../../api-client';

const server = 'localhost';
const token = '1234';

const mockedTranscriptionListResponse = {
  items: [
    {
      voicemail_message_id: '1710000000-00000001',
      tenant_uuid: '47bfdafc-2897-4369-8fb3-153d41fb835d',
      voicemail_id: 42,
      transcript: 'Hi, this is John. Please call me back.',
      provider_id: 'openai-whisper',
      language: 'en',
      duration: 5.2,
      created_at: '2026-03-12T14:30:00+00:00',
    },
  ],
  total: 1,
  filtered: 1,
};

const mockedTranscriptionResponse = {
  voicemail_message_id: '1710000000-00000001',
  tenant_uuid: '47bfdafc-2897-4369-8fb3-153d41fb835d',
  voicemail_id: 42,
  transcript: 'Hi, this is John. Please call me back.',
  provider_id: 'openai-whisper',
  language: 'en',
  duration: 5.2,
  created_at: '2026-03-12T14:30:00+00:00',
};

const mockedJson = (data: any) => ({
  ok: true,
  json: () => Promise.resolve(data),
  headers: { get: () => 'application/json' },
});

const client = new WazoApiClient({ server });
client.setToken(token);

describe('call-logd voicemail transcriptions', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('listUserMeVoicemailTranscriptions', () => {
    it('calls the correct endpoint with query params', async () => {
      const fetchMock = jest.fn(() => Promise.resolve(mockedJson(mockedTranscriptionListResponse)) as any);
      Object.defineProperty(global, 'fetch', { value: fetchMock });

      const result = await client.callLogd.listUserMeVoicemailTranscriptions({
        from: '2026-03-01',
        until: '2026-03-31',
        limit: 10,
        offset: 0,
        order: 'created_at',
        direction: 'desc',
        search_text: 'John',
      });

      expect(result.items).toEqual(mockedTranscriptionListResponse.items);
      expect(result.total).toBe(mockedTranscriptionListResponse.total);
      expect(result.filtered).toBe(mockedTranscriptionListResponse.filtered);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/call-logd/1.0/users/me/voicemails/transcriptions'),
        expect.objectContaining({
          method: 'get',
        }),
      );
      const fetchUrl = (fetchMock.mock.calls[0] as any)[0];
      expect(fetchUrl).toContain('from=2026-03-01');
      expect(fetchUrl).toContain('until=2026-03-31');
      expect(fetchUrl).toContain('limit=10');
      expect(fetchUrl).toContain('order=created_at');
      expect(fetchUrl).toContain('direction=desc');
      expect(fetchUrl).toContain('search_text=John');
    });

    it('serializes voicemail_id array as CSV', async () => {
      const fetchMock = jest.fn(() => Promise.resolve(mockedJson(mockedTranscriptionListResponse)) as any);
      Object.defineProperty(global, 'fetch', { value: fetchMock });

      await client.callLogd.listUserMeVoicemailTranscriptions({
        voicemail_id: [42, 43],
      });

      expect((fetchMock.mock.calls[0] as any)[0]).toContain('voicemail_id=42%2C43');
    });
  });

  describe('listVoicemailTranscriptions', () => {
    it('calls the correct endpoint', async () => {
      const fetchMock = jest.fn(() => Promise.resolve(mockedJson(mockedTranscriptionListResponse)) as any);
      Object.defineProperty(global, 'fetch', { value: fetchMock });

      await client.callLogd.listVoicemailTranscriptions({ limit: 5 });

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/call-logd/1.0/voicemails/transcriptions'),
        expect.any(Object),
      );
    });
  });

  describe('getUserMeVoicemailTranscription', () => {
    it('calls the correct endpoint with message id', async () => {
      const fetchMock = jest.fn(() => Promise.resolve(mockedJson(mockedTranscriptionResponse)) as any);
      Object.defineProperty(global, 'fetch', { value: fetchMock });

      const result = await client.callLogd.getUserMeVoicemailTranscription('1710000000-00000001');

      expect(result.voicemail_message_id).toBe(mockedTranscriptionResponse.voicemail_message_id);
      expect(result.transcript).toBe(mockedTranscriptionResponse.transcript);
      expect(result.voicemail_id).toBe(mockedTranscriptionResponse.voicemail_id);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://localhost/api/call-logd/1.0/users/me/voicemails/1710000000-00000001/transcription',
        expect.any(Object),
      );
    });
  });

  describe('listUserVoicemailTranscriptions', () => {
    it('calls the correct endpoint with user uuid', async () => {
      const fetchMock = jest.fn(() => Promise.resolve(mockedJson(mockedTranscriptionListResponse)) as any);
      Object.defineProperty(global, 'fetch', { value: fetchMock });

      await client.callLogd.listUserVoicemailTranscriptions('73cfa622-6f5b-4a0d-9788-ddb72ab57836');

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/call-logd/1.0/users/73cfa622-6f5b-4a0d-9788-ddb72ab57836/voicemails/transcriptions'),
        expect.any(Object),
      );
    });
  });

  describe('getUserVoicemailTranscription', () => {
    it('calls the correct endpoint with user uuid and message id', async () => {
      const fetchMock = jest.fn(() => Promise.resolve(mockedJson(mockedTranscriptionResponse)) as any);
      Object.defineProperty(global, 'fetch', { value: fetchMock });

      await client.callLogd.getUserVoicemailTranscription('73cfa622-6f5b-4a0d-9788-ddb72ab57836', '1710000000-00000001');

      expect(fetchMock).toHaveBeenCalledWith(
        'https://localhost/api/call-logd/1.0/users/73cfa622-6f5b-4a0d-9788-ddb72ab57836/voicemails/1710000000-00000001/transcription',
        expect.any(Object),
      );
    });
  });
});
