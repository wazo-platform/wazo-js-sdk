/* @flow */
import ApiRequester from '../utils/api-requester';
import type { UUID, ListConfdUsersResponse, ListApplicationsResponse } from '../domain/types';
import Profile from '../domain/Profile';
import SipLine from '../domain/SipLine';
import ExternalApp from '../domain/ExternalApp';
import Meeting from '../domain/Meeting';

export default (client: ApiRequester, baseUrl: string) => ({
  listUsers: (): Promise<ListConfdUsersResponse> => client.get(`${baseUrl}/users`, null),

  getUser: (userUuid: string): Promise<Profile> => client.get(`${baseUrl}/users/${userUuid}`, null).then(Profile.parse),

  updateUser: (userUuid: string, profile: Profile): Promise<Boolean> => {
    const body = {
      firstname: profile.firstName,
      lastname: profile.lastName,
      email: profile.email,
      mobile_phone_number: profile.mobileNumber,
    };

    return client.put(`${baseUrl}/users/${userUuid}`, body, null, ApiRequester.successResponseParser);
  },

  updateForwardOption: (userUuid: string, key: string, destination: string, enabled: Boolean): Promise<Boolean> => {
    const url = `${baseUrl}/users/${userUuid}/forwards/${key}`;
    return client.put(url, { destination, enabled }, null, ApiRequester.successResponseParser);
  },

  updateDoNotDisturb: (userUuid: UUID, enabled: Boolean): Promise<Boolean> =>
    client.put(`${baseUrl}/users/${userUuid}/services/dnd`, { enabled }, null, ApiRequester.successResponseParser),

  getUserLineSip: (userUuid: string, lineId: string): Promise<SipLine> =>
    client.get(`${baseUrl}/users/${userUuid}/lines/${lineId}/associated/endpoints/sip?view=merged`).then(SipLine.parse),

  getUserLinesSip(userUuid: string, lineIds: string[]): Promise<SipLine>[] {
    // We have to catch all exception, unless Promise.all will returns an empty array for 2 lines with a custom one:
    // The custom line will throw a 404 and break the Promise.all.
    // $FlowFixMe
    return Promise.all(lineIds.map(lineId => this.getUserLineSip(userUuid, lineId).catch(() => null)));
  },

  getUserLineSipFromToken(userUuid: string) {
    return this.getUser(userUuid).then(user => {
      if (!user.lines.length) {
        console.warn(`No sip line for user: ${userUuid}`);
        return null;
      }
      const line = user.lines[0];

      return this.getUserLineSip(userUuid, line.uuid || line.id);
    });
  },

  listApplications: (): Promise<ListApplicationsResponse> => client.get(`${baseUrl}/applications`, null),

  getInfos: (): Promise<{ uuid: string, wazo_version: string }> => client.get(`${baseUrl}/infos`, null),

  getExternalApps: (userUuid: string): Promise<ExternalApp[]> =>
    client.get(`${baseUrl}/users/${userUuid}/external/apps`).then(ExternalApp.parseMany),

  getExternalApp: async (userUuid: string, name: string): Promise<?ExternalApp> => {
    const url = `${baseUrl}/users/${userUuid}/external/apps/${name}?view=fallback`;

    try {
      return await client.get(url).then(ExternalApp.parse);
    } catch (e) {
      return null;
    }
  },

  createMyMeeting: (name: string): Promise<Meeting> =>
    client.post(`${baseUrl}/users/me/meetings`, { name }).then(Meeting.parse),

  deleteMyMeeting: (meetingUuid: string): Promise<Meeting> =>
    client.delete(`${baseUrl}/users/me/meetings/${meetingUuid}`, null),

  getMeeting: (meetingUuid: string): Promise<Meeting> =>
    client.get(`${baseUrl}/meetings/${meetingUuid}`, null).then(Meeting.parse),

  guestGetMeeting: (meetingUuid: string): Promise<Meeting> =>
    client.get(`${baseUrl}/guests/me/meetings/${meetingUuid}`, null).then(Meeting.parse),
});
