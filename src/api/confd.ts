import ApiRequester from '../utils/api-requester';
import type { UUID, ListConfdUsersResponse, ListApplicationsResponse } from '../domain/types';
import type { MeetingCreateArguments, MeetingUpdateArguments } from '../domain/Meeting';
import CallerID from '../domain/CallerID';
import Profile from '../domain/Profile';
import SipLine from '../domain/SipLine';
import ExternalApp from '../domain/ExternalApp';
import Meeting from '../domain/Meeting';
import MeetingAuthorization from '../domain/MeetingAuthorization';
import { convertKeysFromCamelToUnderscore } from '../utils/object';
import { ForwardName } from '../domain/ForwardOption';

export interface ConfD {
  listUsers: () => Promise<ListConfdUsersResponse>;
  getUser: (userUuid: string) => Promise<Profile>;
  updateUser: (userUuid: string, profile: Profile) => Promise<boolean>;
  updateForwardOption: (userUuid: string, key: ForwardName, destination: string, enabled: boolean) => Promise<boolean>;
  updateForwardOptions: (userUuid: string, options: Record<ForwardName, { destination: string, enabled: boolean }>) => Promise<boolean>;
  updateDoNotDisturb: (userUuid: UUID, enabled: boolean) => Promise<boolean>;
  getUserLineSip: (userUuid: string, lineId: string) => Promise<SipLine>;
  getUserLinesSip: (userUuid: string, lineIds: string[]) => Promise<(SipLine | null)[]>;
  getUserLineSipFromToken: (userUuid: string) => Promise<any>; // @TODO
  listApplications: () => Promise<ListApplicationsResponse>;
  getInfos: () => Promise<{
    uuid: string;
    wazo_version: string;
  }>;
  getExternalApps: (userUuid: string) => Promise<ExternalApp[]>;
  getExternalApp: (userUuid: string, name: string) => Promise<ExternalApp | null | undefined>;
  getMyMeetings: () => Promise<Meeting>;
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
}

export default ((client: ApiRequester, baseUrl: string): ConfD => ({
  listUsers: (): Promise<ListConfdUsersResponse> => client.get(`${baseUrl}/users`, null),
  getUser: (userUuid: string): Promise<Profile> => client.get(`${baseUrl}/users/${userUuid}`, null).then(Profile.parse),
  updateUser: (userUuid: string, profile: Profile): Promise<boolean> => {
    const body = {
      firstname: profile.firstName,
      lastname: profile.lastName,
      email: profile.email,
      mobile_phone_number: profile.mobileNumber,
    };
    return client.put(`${baseUrl}/users/${userUuid}`, body, null, ApiRequester.successResponseParser);
  },
  updateForwardOption: (userUuid: string, key: ForwardName, destination: string, enabled: boolean): Promise<boolean> => {
    const url = `${baseUrl}/users/${userUuid}/forwards/${key}`;
    return client.put(url, {
      destination,
      enabled,
    }, null, ApiRequester.successResponseParser);
  },
  updateForwardOptions: (userUuid: string, options: Record<ForwardName, { destination: string, enabled: boolean }>): Promise<boolean> => {
    const url = `${baseUrl}/users/${userUuid}/forwards`;
    return client.put(url, options, null, ApiRequester.successResponseParser);
  },
  updateDoNotDisturb: (userUuid: UUID, enabled: boolean): Promise<boolean> => client.put(`${baseUrl}/users/${userUuid}/services/dnd`, {
    enabled,
  }, null, ApiRequester.successResponseParser),
  getUserLineSip: (userUuid: string, lineId: string): Promise<SipLine> => client.get(`${baseUrl}/users/${userUuid}/lines/${lineId}/associated/endpoints/sip?view=merged`).then(SipLine.parse),

  getUserLinesSip(userUuid: string, lineIds: string[]): Promise<(SipLine | null)[]> {
    // We have to catch all exception, unless Promise.all will returns an empty array for 2 lines with a custom one:
    // The custom line will throw a 404 and break the Promise.all.
    return Promise.all(lineIds.map(lineId => this.getUserLineSip(userUuid, lineId).catch(() => null)));
  },

  getUserLineSipFromToken(userUuid: string) {
    return this.getUser(userUuid).then(user => {
      if (!user.lines.length) {
        console.warn(`No sip line for user: ${userUuid}`);
        return null;
      }

      const line:any = user.lines[0];
      return this.getUserLineSip(userUuid, line.uuid || line.id);
    });
  },

  listApplications: (): Promise<ListApplicationsResponse> => client.get(`${baseUrl}/applications`, null),
  getInfos: (): Promise<{
    uuid: string;
    wazo_version: string;
  }> => client.get(`${baseUrl}/infos`, null),
  getExternalApps: (userUuid: string): Promise<ExternalApp[]> => client.get(`${baseUrl}/users/${userUuid}/external/apps`).then(ExternalApp.parseMany),
  getExternalApp: async (userUuid: string, name: string): Promise<ExternalApp | null | undefined> => {
    const url = `${baseUrl}/users/${userUuid}/external/apps/${name}?view=fallback`;

    try {
      return await client.get(url).then(ExternalApp.parse);
    } catch (e: any) {
      return null;
    }
  },
  getMyMeetings: (): Promise<Meeting> => client.get(`${baseUrl}/users/me/meetings`).then((response: any) => Meeting.parseMany(response.items)),
  createMyMeeting: (args: MeetingCreateArguments): Promise<Meeting> => client.post(`${baseUrl}/users/me/meetings`, convertKeysFromCamelToUnderscore(args)).then(Meeting.parse),
  updateMyMeeting: (meetingUuid: string, data: MeetingUpdateArguments): Promise<boolean> => client.put(`${baseUrl}/users/me/meetings/${meetingUuid}`, convertKeysFromCamelToUnderscore(data), null, ApiRequester.successResponseParser),
  deleteMyMeeting: (meetingUuid: string): Promise<Meeting> => client.delete(`${baseUrl}/users/me/meetings/${meetingUuid}`, null),
  getMeeting: (meetingUuid: string): Promise<Meeting> => client.get(`${baseUrl}/meetings/${meetingUuid}`, null).then(Meeting.parse),
  meetingAuthorizations: (meetingUuid: string): Promise<Array<MeetingAuthorization>> => client.get(`${baseUrl}/users/me/meetings/${meetingUuid}/authorizations`, null).then((response: any) => MeetingAuthorization.parseMany(response.items)),
  meetingAuthorizationReject: (meetingUuid: string, authorizationUuid: string): Promise<boolean> => client.put(`${baseUrl}/users/me/meetings/${meetingUuid}/authorizations/${authorizationUuid}/reject`, {}, null, ApiRequester.successResponseParser),
  meetingAuthorizationAccept: (meetingUuid: string, authorizationUuid: string): Promise<boolean> => client.put(`${baseUrl}/users/me/meetings/${meetingUuid}/authorizations/${authorizationUuid}/accept`, {}, null, ApiRequester.successResponseParser),
  guestGetMeeting: (meetingUuid: string): Promise<Meeting> => client.get(`${baseUrl}/guests/me/meetings/${meetingUuid}`, null).then(Meeting.parse),
  guestAuthorizationRequest: (userUuid: string, meetingUuid: string, username: string): Promise<any> => client.post(`${baseUrl}/guests/${userUuid}/meetings/${meetingUuid}/authorizations`, {
    guest_name: username,
  }).then(MeetingAuthorization.parse),
  guestAuthorizationCheck: (userUuid: string, meetingUuid: string, authorizationUuid: string): Promise<any> => client.get(`${baseUrl}/guests/${userUuid}/meetings/${meetingUuid}/authorizations/${authorizationUuid}`, null),
  getOutgoingCallerIDs: (userUuid: string): Promise<CallerID[]> => client.get(`${baseUrl}/users/${userUuid}/callerids/outgoing`, null).then(CallerID.parseMany),
}));
