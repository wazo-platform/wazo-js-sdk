import ApiRequester from '../utils/api-requester';

export default ((client: ApiRequester, baseUrl: string) => ({
  action: (action: string, args: Record<string, any> = {}): Promise<string> => client.post(`${baseUrl}/action/${action}`, args),

  getAors: async (endpoint: string): Promise<any[]> => {
    try {
      const rawEvents = await client.post(`${baseUrl}/action/PJSIPShowEndpoint`, {
        Endpoint: endpoint,
      }) || [];

      if (!rawEvents) {
        return [];
      }

      return rawEvents.filter((event: Record<string, any>) => event.Event === 'ContactStatusDetail');
    } catch {
      return [];
    }
  },
}));
