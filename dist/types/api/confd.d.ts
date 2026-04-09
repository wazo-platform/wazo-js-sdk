import ApiRequester from '../utils/api-requester';
import type { UUID, ListConfdUsersResponse, ListApplicationsResponse, BlockNumber, BlockNumberBody } from '../domain/types';
import type { MeetingCreateArguments, MeetingUpdateArguments } from '../domain/Meeting';
import CallerID from '../domain/CallerID';
import Profile from '../domain/Profile';
import SipLine from '../domain/SipLine';
import ExternalApp from '../domain/ExternalApp';
import Meeting from '../domain/Meeting';
import MeetingAuthorization from '../domain/MeetingAuthorization';
import { ForwardName } from '../domain/ForwardOption';
import { ApiParams, ListResponse } from '../types/api';
type GetBlockNumbersSearchParams = {
    number?: string;
    name?: string;
};
declare const _default: (client: ApiRequester, baseUrl: string) => {
    listUsers: () => Promise<ListConfdUsersResponse>;
    getUser: (userUuid: string) => Promise<Profile>;
    updateUser: (userUuid: string, profile: Profile) => Promise<boolean>;
    updateForwardOption: (userUuid: string, key: ForwardName, destination: string, enabled: boolean) => Promise<boolean>;
    updateForwardOptions: (userUuid: string, options: Record<ForwardName, {
        destination: string;
        enabled: boolean;
    }>) => Promise<boolean>;
    updateDoNotDisturb: (userUuid: UUID, enabled: boolean) => Promise<boolean>;
    getUserLineSip: (userUuid: string, lineId: string) => Promise<SipLine>;
    getUserLinesSip(userUuid: string, lineIds: string[]): Promise<(SipLine | null)[]>;
    getUserLineSipFromToken(userUuid: string): Promise<any>;
    listApplications: () => Promise<ListApplicationsResponse>;
    getInfos: () => Promise<{
        uuid: string;
        wazo_version: string;
    }>;
    getExternalApps: (userUuid: string) => Promise<ExternalApp[]>;
    getExternalApp: (userUuid: string, name: string) => Promise<ExternalApp | null | undefined>;
    getMyMeetings: () => Promise<Meeting[]>;
    createMyMeeting: (args: MeetingCreateArguments) => Promise<Meeting>;
    updateMyMeeting: (meetingUuid: string, data: MeetingUpdateArguments) => Promise<boolean>;
    deleteMyMeeting: (meetingUuid: string) => Promise<Meeting>;
    getMeeting: (meetingUuid: string) => Promise<Meeting>;
    meetingAuthorizations: (meetingUuid: string) => Promise<Array<MeetingAuthorization>>;
    meetingAuthorizationReject: (meetingUuid: string, authorizationUuid: string) => Promise<boolean>;
    meetingAuthorizationAccept: (meetingUuid: string, authorizationUuid: string) => Promise<boolean>;
    guestGetMeeting: (meetingUuid: string) => Promise<Meeting>;
    guestAuthorizationRequest: (userUuid: string, meetingUuid: string, username: string) => Promise<any>;
    guestAuthorizationCheck: (userUuid: string, meetingUuid: string, authorizationUuid: string) => Promise<any>;
    getOutgoingCallerIDs: (userUuid: string) => Promise<CallerID[]>;
    getBlockNumbers: (opts?: ApiParams<GetBlockNumbersSearchParams>) => Promise<ListResponse<BlockNumber>>;
    getBlockNumber: (uuid: UUID) => Promise<BlockNumber>;
    createBlockNumber: (body: BlockNumberBody) => Promise<BlockNumber>;
    updateBlockNumber: (uuid: string, body: BlockNumberBody) => Promise<boolean>;
    deleteBlockNumber: (uuid: string) => Promise<boolean>;
};
export default _default;
//# sourceMappingURL=confd.d.ts.map