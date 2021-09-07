import WazoApiClient from '../../api-client';
import ServerError from '../../domain/ServerError';

export default {
  name: 'API',
  check: async (server, session) => {
    const client = new WazoApiClient({ server });
    client.setToken(session.token);
    client.disableErrorLogging();

    const handleApiError = (apiName, error) => {
      const statusText = error instanceof ServerError ? 'server error' : 'api error';

      throw new Error(`${apiName} fails with status (${error.status}, ${statusText}) : ${error.message}`);
    };

    // Check simple API call
    try {
      await client.auth.getPushNotificationSenderId(session.uuid);
      await client.auth.getProviders(session.uuid);
    } catch (e) {
      handleApiError('wazo-auth', e);
    }

    try {
      await client.callLogd.listCallLogs();
    } catch (e) {
      handleApiError('wazo-callogd', e);
    }

    try {
      await client.calld.listCalls();
    } catch (e) {
      handleApiError('wazo-calld', e);
    }

    try {
      await client.calld.listVoicemails();
    } catch (e) {
      // API throws a 404 when no voicemail
      if (e.status !== 404) {
        handleApiError('wazo-calld', e);
      }
    }

    try {
      await client.chatd.getState(session.uuid);
      await client.chatd.getContactStatusInfo(session.uuid);
      await client.chatd.getUserRooms();
    } catch (e) {
      handleApiError('wazo-chatd', e);
    }

    try {
      await client.confd.getInfos();
      await client.confd.getUser(session.uuid);
    } catch (e) {
      handleApiError('wazo-confd', e);
    }

    try {
      await client.dird.listPersonalContacts();
      await client.dird.listFavorites(session.primaryContext());
      await client.dird.fetchWazoSource(session.primaryContext());
      const conferenceSource = await client.dird.fetchConferenceSource(session.primaryContext());
      await client.dird.fetchConferenceContacts(conferenceSource.items[0]);
    } catch (e) {
      handleApiError('wazo-dird', e);
    }

    try {
      await client.webhookd.getSubscriptions();
    } catch (e) {
      handleApiError('wazo-webhookd', e);
    }
  },
};
