import ApiRequester from '../utils/api-requester';
import type { UUID, CTITransfer } from '../domain/types';
import Relocation from '../domain/Relocation';
import ChatMessage from '../domain/ChatMessage';
import Voicemail from '../domain/Voicemail';
import Call, { CallResponse } from '../domain/Call';
type GetPresenceResponse = {
    presence: string;
    user_uuid: string;
    xivo_uuid: string;
};
declare const _default: (client: ApiRequester, baseUrl: string) => {
    updatePresence: (presence: string) => Promise<boolean>;
    listMessages: (participantUuid: UUID | null | undefined, limit?: number) => Promise<Array<ChatMessage>>;
    sendMessage: (alias: string, msg: string, toUserId: string) => Promise<boolean>;
    makeCall: (extension: string, fromMobile: boolean, lineId: number | null | undefined, allLines?: boolean | null | undefined) => Promise<CallResponse>;
    cancelCall: (callId: number) => Promise<boolean>;
    listCalls: () => Promise<Array<Call>>;
    relocateCall(callId: number, destination: string, lineId: number | null | undefined, contact?: string | null | undefined): Promise<Relocation>;
    transferCall(callId: number, number: string, flow?: string): Promise<CTITransfer>;
    cancelCallTransfer: (transferId: string) => Promise<void>;
    confirmCallTransfer: (transferId: string) => Promise<void>;
    listVoicemails: () => Promise<Array<Voicemail>>;
    deleteVoicemail: (voicemailId: number) => Promise<boolean>;
    getPresence: (contactUuid: UUID) => Promise<GetPresenceResponse>;
    getStatus: (lineUuid: UUID) => Promise<string>;
    fetchSwitchboardHeldCalls: (switchboardUuid: UUID) => Promise<any>;
    holdSwitchboardCall: (switchboardUuid: UUID, callId: string) => Promise<boolean>;
    answerSwitchboardHeldCall: (switchboardUuid: UUID, callId: string) => Promise<boolean>;
    fetchSwitchboardQueuedCalls: (switchboardUuid: UUID) => Promise<boolean>;
    answerSwitchboardQueuedCall: (switchboardUuid: UUID, callId: string) => Promise<boolean>;
    sendFax: (extension: string, fax: string, callerId?: string | null | undefined) => Promise<any>;
};
export default _default;
//# sourceMappingURL=ctid-ng.d.ts.map