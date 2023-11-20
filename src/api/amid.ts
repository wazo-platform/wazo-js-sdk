import ApiRequester from '../utils/api-requester';

export interface AmiD {
  action: (action: string, args: Record<string, any>) => Promise<string>;
  getAors: (endpoint: string) => Promise<any[]>;
}

export default ((client: ApiRequester, baseUrl: string): AmiD => ({
  action: (action: string, args: Record<string, any> = {}): Promise<string> => client.post(`${baseUrl}/action/${action}`, args),
  getAors: async (endpoint: string) => {
    const rawEvents = await client.post(`${baseUrl}/action/PJSIPShowEndpoint`, {
      Endpoint: endpoint,
    }) || [];
    return rawEvents.filter((event: Record<string, any>) => event.Event === 'ContactStatusDetail');
  },
}));
