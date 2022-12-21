import { $Shape } from "utility-types";
type AgentResponse = {
  context: string;
  extension: string;
  id: number;
  logged: boolean;
  number: string;
  paused: boolean;
  paused_reason: string;
};
type AgentArguments = {
  context: string;
  extension: string;
  id: number;
  logged: boolean;
  number: string;
  paused: boolean;
  pausedReason: string;
};

class Agent {
  context: string;
  extension: string;
  id: number;
  logged: boolean;
  number: string;
  paused: boolean;
  pausedReason: string;

  static parse(plain: AgentResponse): Agent {
    return new Agent({
      context: plain.context,
      extension: plain.extension,
      id: plain.id,
      logged: plain.logged,
      number: plain.number,
      paused: plain.paused,
      pausedReason: plain.paused_reason
    });
  }

  constructor({
    context,
    extension,
    id,
    logged,
    number,
    paused,
    pausedReason
  }: $Shape<AgentArguments>) {
    this.context = context;
    this.extension = extension;
    this.id = id;
    this.logged = logged;
    this.number = number;
    this.paused = paused;
    this.pausedReason = pausedReason;
  }

}

export default Agent;