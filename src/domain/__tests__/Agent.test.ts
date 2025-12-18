import Agent, { AgentArguments, AgentResponse } from '../Agent';

const fieldMap: Record<string, any> = {
  context: 'context',
  extension: 'extension',
  id: 'id',
  logged: 'logged',
  number: 'number',
  originUuid: 'origin_uuid',
  paused: 'paused',
  pausedReason: 'paused_reason',
  stateInterface: 'state_interface',
  tenantUuid: 'tenant_uuid',
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
  queues: [
    {
      display_name: 'Test Queue',
      id: 1,
      logged: true,
      name: 'test_queue',
      paused: false,
      paused_reason: '',
    },
  ],
  state_interface: 'undefined_state_interface',
  tenant_uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
};
const formatted: Record<string, any> = {};
Object.keys(fieldMap).forEach((field: string) => {
  formatted[field] = plain[fieldMap[field]];
});
// Add queues with proper transformation
formatted.queues = plain.queues.map((queue: any) => ({
  displayName: queue.display_name,
  id: queue.id,
  logged: queue.logged,
  name: queue.name,
  paused: queue.paused,
  pausedReason: queue.paused_reason,
}));
describe('Call Center Agent domain', () => {
  it('should keep its values', () => {
    const agent = new Agent(formatted as AgentArguments) as any;
    expect(agent).toBeInstanceOf(Agent);
    Object.keys(fieldMap).map(key => expect(agent[key]).toBe(formatted[key]));
    expect(agent.queues).toEqual(formatted.queues);
  });
  it('can parse a plain call center agent to domain', () => {
    const agent = Agent.parse(plain as AgentResponse);
    expect(agent).toEqual(new Agent(formatted as AgentArguments));
  });
  describe('backward compatibility', () => {
    it('should handle missing new fields from older backends', () => {
      const legacyPlain: AgentResponse = {
        context: 'legacy_context',
        extension: 'legacy_extension',
        id: 5678,
        logged: false,
        number: 'legacy_number',
        paused: false,
        paused_reason: '',
        // origin_uuid, queues, state_interface, tenant_uuid are intentionally omitted
      };
      const agent = Agent.parse(legacyPlain);
      expect(agent).toBeInstanceOf(Agent);
      expect(agent.context).toBe('legacy_context');
      expect(agent.extension).toBe('legacy_extension');
      expect(agent.id).toBe(5678);
      expect(agent.logged).toBe(false);
      expect(agent.number).toBe('legacy_number');
      expect(agent.paused).toBe(false);
      expect(agent.pausedReason).toBe('');
      // Verify defaults are applied for missing fields
      expect(agent.originUuid).toBe('');
      expect(agent.stateInterface).toBe('');
      expect(agent.tenantUuid).toBe('');
      expect(agent.queues).toEqual([]);
    });
    it('should allow creating Agent without new optional fields', () => {
      const legacyArgs: AgentArguments = {
        context: 'legacy_context',
        extension: 'legacy_extension',
        id: 5678,
        logged: false,
        number: 'legacy_number',
        paused: false,
        pausedReason: '',
        // originUuid, queues, stateInterface, tenantUuid are intentionally omitted
      };
      const agent = new Agent(legacyArgs);
      expect(agent).toBeInstanceOf(Agent);
      expect(agent.originUuid).toBe('');
      expect(agent.stateInterface).toBe('');
      expect(agent.tenantUuid).toBe('');
      expect(agent.queues).toEqual([]);
    });
  });
});
