import ApiRequester from "../utils/api-requester";
export default ((client: ApiRequester, baseUrl: string) => ({
  action: (action: string, args: Record<string, any> = {}): Promise<string> => client.post(`${baseUrl}/action/${action}`, args),
  getAors: async (endpoint: string) => {
    const rawEvents = await client.post(`${baseUrl}/action/PJSIPShowEndpoint`, {
      Endpoint: endpoint
    });
    return rawEvents.filter(event => event.Event === 'ContactStatusDetail');
  }
}));