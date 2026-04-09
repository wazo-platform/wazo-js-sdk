import ApiRequester from '../utils/api-requester';
import Agent from '../domain/Agent';
declare const _default: (client: ApiRequester, baseUrl: string) => {
    getAgent: (agentId: string) => Promise<Agent>;
    login: (agentNumber: string, context: string, extension: string) => Promise<boolean>;
    loginWithLineId: (lineId: number) => Promise<boolean>;
    logout: (agentNumber: string) => Promise<boolean>;
    pause: (agentNumber: string, reason?: string) => Promise<boolean>;
    resume: (agentNumber: string) => Promise<boolean>;
    getStatus: () => Promise<Agent>;
    staticLogout: () => Promise<boolean>;
    staticPause: (reason?: string) => Promise<boolean>;
    staticResume: () => Promise<boolean>;
    loginToQueue: (queueId: string) => Promise<boolean>;
    logoffFromQueue: (queueId: string) => Promise<boolean>;
};
export default _default;
//# sourceMappingURL=agentd.d.ts.map