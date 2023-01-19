import ApiRequester from '../utils/api-requester';
import Agent from '../domain/Agent';

export interface AgentD {
  getAgent: (agentId: string) => Promise<Agent>;
  login: (agentNumber: string, context: string, extension: string) => Promise<boolean>;
  loginWithLineId: (lineId: number) => Promise<boolean>;
  logout: (agentNumber: string) => Promise<boolean>;
  pause: (agentNumber: string) => Promise<boolean>;
  resume: (agentNumber: string) => Promise<boolean>;
  getStatus: () => Promise<Agent>;
  staticLogout: () => Promise<boolean>;
  staticPause: () => Promise<boolean>;
  staticResume: () => Promise<boolean>;
}

export default ((client: ApiRequester, baseUrl: string): AgentD => ({
  getAgent: (agentId: string): Promise<Agent> => client.get(`${baseUrl}/agents/by-id/${agentId}`, null).then(Agent.parse),
  login: (agentNumber: string, context: string, extension: string) => client.post(`${baseUrl}/agents/by-number/${agentNumber}/login`, {
    context,
    extension,
  }, null, ApiRequester.successResponseParser),
  loginWithLineId: (lineId: number) => client.post(`${baseUrl}/users/me/agents/login`, {
    line_id: lineId,
  }, null, ApiRequester.successResponseParser),
  logout: (agentNumber: string) => client.post(`${baseUrl}/agents/by-number/${agentNumber}/logoff`, null, null, ApiRequester.successResponseParser),
  pause: (agentNumber: string) => client.post(`${baseUrl}/agents/by-number/${agentNumber}/pause`, {
    reason: 'songbird_reason',
  }, null, ApiRequester.successResponseParser),
  resume: (agentNumber: string) => client.post(`${baseUrl}/agents/by-number/${agentNumber}/unpause`, null, null, ApiRequester.successResponseParser),
  getStatus: (): Promise<Agent> => client.get(`${baseUrl}/users/me/agents`, null).then(Agent.parse),
  staticLogout: () => client.post(`${baseUrl}/users/me/agents/logoff`, null, null, ApiRequester.successResponseParser),
  staticPause: () => client.post(`${baseUrl}/users/me/agents/pause`, {
    reason: 'songbird_reason',
  }, null, ApiRequester.successResponseParser),
  staticResume: () => client.post(`${baseUrl}/users/me/agents/unpause`, null, null, ApiRequester.successResponseParser),
}));
