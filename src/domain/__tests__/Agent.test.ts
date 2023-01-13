import Agent, { AgentResponse } from '../Agent';

const fieldMap: Record<string, any> = {
  context: 'context',
  extension: 'extension',
  id: 'id',
  logged: 'logged',
  number: 'number',
  paused: 'paused',
  pausedReason: 'paused_reason',
};
const plain: Record<string, any> = {
  context: 'bogus_context',
  extension: 'bogus_extension',
  id: 1234,
  logged: true,
  number: 'number',
  origin_uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  paused: true,
  paused_reason: 'this is a reason',
  state_interface: 'undefined_state_interface',
  tenant_uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
};
const formatted: Record<string, any> = {};
Object.keys(fieldMap).forEach((field: string) => {
  formatted[field] = plain[fieldMap[field]];
});
describe('Call Center Agent domain', () => {
  it('should keep its values', () => {
    // @ts-expect-error
    const agent = new Agent(formatted);
    expect(agent).toBeInstanceOf(Agent);
    Object.keys(fieldMap).map(key => expect(agent[key]).toBe(formatted[key]));
  });
  it('can parse a plain call center agent to domain', () => {
    const agent = Agent.parse(plain as AgentResponse);
    // @ts-expect-error
    expect(agent).toEqual(new Agent(formatted));
  });
});
