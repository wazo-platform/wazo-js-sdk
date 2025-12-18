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

class Agent {
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

  static parse(plain: AgentResponse): Agent {
    return new Agent({
      context: plain.context,
      extension: plain.extension,
      id: plain.id,
      logged: plain.logged,
      number: plain.number,
      originUuid: plain.origin_uuid ?? '',
      paused: plain.paused,
      pausedReason: plain.paused_reason,
      queues: plain.queues
        ? plain.queues.map(queue => ({
          displayName: queue.display_name,
          id: queue.id,
          logged: queue.logged,
          name: queue.name,
          paused: queue.paused,
          pausedReason: queue.paused_reason,
        }))
        : [],
      stateInterface: plain.state_interface ?? '',
      tenantUuid: plain.tenant_uuid ?? '',
    });
  }

  constructor({
    context,
    extension,
    id,
    logged,
    number,
    originUuid = '',
    paused,
    pausedReason,
    queues = [],
    stateInterface = '',
    tenantUuid = '',
  }: AgentArguments) {
    this.context = context;
    this.extension = extension;
    this.id = id;
    this.logged = logged;
    this.number = number;
    this.originUuid = originUuid;
    this.paused = paused;
    this.pausedReason = pausedReason;
    this.queues = queues;
    this.stateInterface = stateInterface;
    this.tenantUuid = tenantUuid;
  }

}

export default Agent;
