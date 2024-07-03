import { type ActorRefFrom, setup } from 'xstate';

export const States = {
  UNREGISTERED: 'unregistered',
  REGISTERING: 'registering',
  REGISTERED: 'registered',
} as const;

export type StateTypes = typeof States[keyof typeof States];

export const Actions = {
  REGISTER: 'register',
  REGISTER_DONE: 'registerDone',
  UNREGISTER: 'unregister',
  UNREGISTERED: 'unregistered',
  TRANSPORT_CLOSED: 'transportClosed',
} as const;

export type ActionTypes = typeof Actions[keyof typeof Actions];

const softphoneMachine = setup({}).createMachine({
  id: 'softphone',
  initial: States.UNREGISTERED,
  context: {},
  states: {
    [States.UNREGISTERED]: {
      on: {
        [Actions.REGISTER]: States.REGISTERING,
      },
    },
    [States.REGISTERING]: {
      on: {
        [Actions.REGISTER_DONE]: States.REGISTERED,
        [Actions.TRANSPORT_CLOSED]: States.UNREGISTERED,
        [Actions.UNREGISTERED]: States.UNREGISTERED,
      },
    },
    [States.REGISTERED]: {
      on: {
        [Actions.UNREGISTER]: States.UNREGISTERED,
        [Actions.TRANSPORT_CLOSED]: States.UNREGISTERED,
      },
    },
  },
});

export type SoftphoneActorRef = ActorRefFrom<typeof softphoneMachine>;

export default softphoneMachine;
