import ApiRequester from '../utils/api-requester';
import Agent from '../domain/Agent';

export default ((client: ApiRequester, baseUrl: string) => ({
  getAgent: (agentId: string): Promise<Agent> => client.get(`${baseUrl}/agents/by-id/${agentId}`, null).then(Agent.parse),

  login: (agentNumber: string, context: string, extension: string): Promise<boolean> => client.post(`${baseUrl}/agents/by-number/${agentNumber}/login`, {
    context,
    extension,
  }, null, ApiRequester.successResponseParser),

  loginWithLineId: (lineId: number): Promise<boolean> => client.post(`${baseUrl}/users/me/agents/login`, {
    line_id: lineId,
  }, null, ApiRequester.successResponseParser),

  logout: (agentNumber: string): Promise<boolean> => client.post(`${baseUrl}/agents/by-number/${agentNumber}/logoff`, null, null, ApiRequester.successResponseParser),

  pause: (agentNumber: string): Promise<boolean> => client.post(`${baseUrl}/agents/by-number/${agentNumber}/pause`, {
    reason: 'songbird_reason',
  }, null, ApiRequester.successResponseParser),

  resume: (agentNumber: string): Promise<boolean> => client.post(`${baseUrl}/agents/by-number/${agentNumber}/unpause`, null, null, ApiRequester.successResponseParser),

  getStatus: (): Promise<Agent> => client.get(`${baseUrl}/users/me/agents`, null).then(Agent.parse),

  staticLogout: (): Promise<boolean> => client.post(`${baseUrl}/users/me/agents/logoff`, null, null, ApiRequester.successResponseParser),

  staticPause: (): Promise<boolean> => client.post(`${baseUrl}/users/me/agents/pause`, {
    reason: 'songbird_reason',
  }, null, ApiRequester.successResponseParser),

  staticResume: (): Promise<boolean> => client.post(`${baseUrl}/users/me/agents/unpause`, null, null, ApiRequester.successResponseParser),
}));
