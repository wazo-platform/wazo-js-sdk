import { fromPromise, setup } from 'xstate';

export const States = {
  STATE_UNREGISTERED: 'unregistered',
  STATE_REGISTERING: 'registering',
  STATE_REGISTERED: 'registered',
} as const;

export type StateTypes = typeof States[keyof typeof States];

export const Actions = {
  ACTION_REGISTER: 'register',
  ACTION_REGISTER_DONE: 'registerDone',
  ACTION_UNREGISTER: 'unregister',
  ACTION_TRANSPORT_CLOSED: 'transportClosed',
} as const;

export type ActionTypes = typeof Actions[keyof typeof Actions];

const softphoneMachine = setup({
  actors: {
    waitForRegister: fromPromise(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    ),
  },
}).createMachine({
  id: 'softphone',
  initial: STATE_UNREGISTERED,
  context: {},
  states: {
    [STATE_UNREGISTERED]: {
      on: {
        [Actions.ACTION_REGISTER]: STATE_REGISTERING,
      },
    },
    [STATE_REGISTERING]: {
      on: {
        [Actions.ACTION_REGISTER_DONE]: STATE_REGISTERED,
        [Actions.ACTION_TRANSPORT_CLOSED]: STATE_UNREGISTERED,
      },
    },
    [STATE_REGISTERED]: {
      on: {
        [Actions.ACTION_UNREGISTER]: STATE_UNREGISTERED,
        [Actions.ACTION_TRANSPORT_CLOSED]: STATE_UNREGISTERED,
      },
    },
  },
});

export default softphoneMachine;
