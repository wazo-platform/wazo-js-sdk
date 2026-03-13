import ApiRequester from '../utils/api-requester';
import CallLog, { CallLogQueryParams } from '../domain/CallLog';
import type { VoicemailTranscription, VoicemailTranscriptionListParams } from '../domain/types';
import type { ListResponse } from '../types/api';

type ListCallLogsQueryParams = Exclude<CallLogQueryParams, 'offset' | 'limit'>;

const serializeListParams = (params: VoicemailTranscriptionListParams): Record<string, any> => {
  const { voicemail_id: voicemailIds, ...rest } = params;
  const result: Record<string, any> = { ...rest };
  if (Array.isArray(voicemailIds) && voicemailIds.length > 0) {
    result.voicemail_id = voicemailIds.join(',');
  }
  return result;
};

export default ((client: ApiRequester, baseUrl: string) => ({
  search: (search: string, limit = 5): Promise<Array<CallLog>> => client.get(`${baseUrl}/users/me/cdr`, {
    search,
    limit,
  }).then(CallLog.parseMany),

  searchBy: (field: string, value: string, limit = 5): Promise<Array<CallLog>> => client.get(`${baseUrl}/users/me/cdr`, {
    [field]: value,
    limit,
  }).then(CallLog.parseMany),

  listCallLogs: (offset?: number, limit = 5, queryParameters: ListCallLogsQueryParams = {}): Promise<Array<CallLog>> => client.get(`${baseUrl}/users/me/cdr`, {
    offset,
    limit,
    ...queryParameters,
  }).then(CallLog.parseMany),

  listDistinctCallLogs: (offset: number, limit = 5, distinct?: string): Promise<Array<CallLog>> => client.get(`${baseUrl}/users/me/cdr`, {
    offset,
    limit,
    distinct,
  }).then(CallLog.parseMany),

  listCallLogsFromDate: (from: Date, number: string): Promise<Array<CallLog>> => client.get(`${baseUrl}/users/me/cdr`, {
    from: from.toISOString(),
    number,
  }).then(CallLog.parseMany),

  listVoicemailTranscriptions: (params: VoicemailTranscriptionListParams = {}): Promise<ListResponse<VoicemailTranscription>> =>
    client.get(`${baseUrl}/voicemails/transcriptions`, serializeListParams(params)),

  listUserMeVoicemailTranscriptions: (params: VoicemailTranscriptionListParams = {}): Promise<ListResponse<VoicemailTranscription>> =>
    client.get(`${baseUrl}/users/me/voicemails/transcriptions`, serializeListParams(params)),

  getUserMeVoicemailTranscription: (voicemailMessageId: string): Promise<VoicemailTranscription> =>
    client.get(`${baseUrl}/users/me/voicemails/${voicemailMessageId}/transcription`),

  listUserVoicemailTranscriptions: (userUuid: string, params: VoicemailTranscriptionListParams = {}): Promise<ListResponse<VoicemailTranscription>> =>
    client.get(`${baseUrl}/users/${userUuid}/voicemails/transcriptions`, serializeListParams(params)),

  getUserVoicemailTranscription: (userUuid: string, voicemailMessageId: string): Promise<VoicemailTranscription> =>
    client.get(`${baseUrl}/users/${userUuid}/voicemails/${voicemailMessageId}/transcription`),
}));
