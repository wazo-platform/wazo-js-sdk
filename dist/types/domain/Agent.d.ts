export type AgentQueueResponse = {
    display_name: string;
    id: number;
    logged: boolean;
    name: string;
    paused: boolean;
    paused_reason: string;
};
export type AgentResponse = {
    context: string;
    extension: string;
    id: number;
    logged: boolean;
    number: string;
    origin_uuid?: string;
    paused: boolean;
    paused_reason: string;
    queues?: AgentQueueResponse[];
    state_interface?: string;
    tenant_uuid?: string;
};
export type AgentQueue = {
    displayName: string;
    id: number;
    logged: boolean;
    name: string;
    paused: boolean;
    pausedReason: string;
};
export type AgentArguments = {
    context: string;
    extension: string;
    id: number;
    logged: boolean;
    number: string;
    originUuid?: string;
    paused: boolean;
    pausedReason: string;
    queues?: AgentQueue[];
    stateInterface?: string;
    tenantUuid?: string;
};
declare class Agent {
    context: string;
    extension: string;
    id: number;
    logged: boolean;
    number: string;
    originUuid: string;
    paused: boolean;
    pausedReason: string;
    queues: AgentQueue[];
    stateInterface: string;
    tenantUuid: string;
    static parse(plain: AgentResponse): Agent;
    constructor({ context, extension, id, logged, number, originUuid, paused, pausedReason, queues, stateInterface, tenantUuid, }: AgentArguments);
}
export default Agent;
//# sourceMappingURL=Agent.d.ts.map