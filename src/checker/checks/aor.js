import WazoApiClient from '../../api-client';

export default {
  name: 'List of AOR',
  check: async (server, session) => {
    const apiClient = new WazoApiClient({ server });
    apiClient.setToken(session.token);
    apiClient.disableErrorLogging();

    const line = session.primaryWebRtcLine();
    if (!line) {
      return 'No WebRTC line for this user';
    }
    const { username } = line;

    try {
      const aors = await apiClient.amid.getAors(username);
      const nbAors = aors.length;
      const availableAors = aors.filter(aor => aor.status === 'Reachable');

      return `Number of AOR: ${nbAors} (${availableAors.length} Avail, ${nbAors - availableAors.length} Unavail)`;
    } catch (e) {
      if (e.status === 401) {
        return 'Not available for this user';
      }

      throw e;
    }
  },
};
