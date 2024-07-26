import { setup, type ActorRefFrom } from 'xstate';

import softphone from '../voice/softphone';
import { States as SoftphoneStates } from './softphone-state-machine';

export const States = {
  IDLE: 'idle',
  RINGING: 'ringing',
  IN_PROGRESS: 'progress',
  ESTABLISHED: 'established',
  TERMINATED: 'terminated',
} as const;

export const EstablishedStates = {
  ONGOING: 'ongoing',
  HELD: 'held',
  MUTED: 'muted',
} as const;

export type StateTypes = typeof States[keyof typeof States];

export type EstablishedStateTypes = typeof EstablishedStates[keyof typeof EstablishedStates];

export const Actions = {
  INCOMING_CALL: 'incomingCall',
  MAKE_CALL: 'makeCall',
  ACCEPT: 'accept',
  REMOTLY_ACCEPTED: 'remotlyAccepted',
  REJECT: 'reject',
  HANGUP: 'hangup',
} as const;

export const EstablishedActions = {
  HOLD: 'hold',
  RESUME: 'resume',
  MUTE: 'mute',
  UN_MUTE: 'unMute',
} as const;

export type ActionTypes = typeof Actions[keyof typeof Actions];

export type EstablishedActionTypes = typeof EstablishedActions[keyof typeof EstablishedActions];

const callMachine = setup({
  guards: {
    isRegistered: () => softphone.state === SoftphoneStates.REGISTERED,
  },
}).createMachine({
  id: 'call',
  initial: States.IDLE,
  context: {},
  states: {
    [States.IDLE]: {
      on: {
        [Actions.INCOMING_CALL]: {
          // guard: 'isRegistered',
          target: States.RINGING,
        },
        [Actions.MAKE_CALL]: {
          guard: 'isRegistered',
          target: States.IN_PROGRESS,
        },
      },
    },
    [States.IN_PROGRESS]: {
      on: {
        [Actions.HANGUP]: {
          guard: 'isRegistered',
          target: States.TERMINATED,
        },
        [Actions.REMOTLY_ACCEPTED]: {
          guard: 'isRegistered',
          target: States.ESTABLISHED,
        },
      },
    },
    [States.RINGING]: {
      on: {
        [Actions.ACCEPT]: {
          guard: 'isRegistered',
          target: States.ESTABLISHED,
        },
        [Actions.REJECT]: {
          guard: 'isRegistered',
          target: States.TERMINATED,
        },
      },
    },
    [States.ESTABLISHED]: {
      initial: EstablishedStates.ONGOING,
      on: {
        [Actions.HANGUP]: {
          guard: 'isRegistered',
          target: States.TERMINATED,
        },
        [EstablishedActions.HOLD]: {
          guard: 'isRegistered',
          target: `.${EstablishedStates.HELD}`,
        },
        [EstablishedActions.MUTE]: {
          guard: 'isRegistered',
          target: `.${EstablishedStates.MUTED}`,
        },
      },
      states: {
        [EstablishedStates.ONGOING]: { },
        [EstablishedStates.HELD]: {
          on: {
            [EstablishedActions.RESUME]: {
              guard: 'isRegistered',
              target: EstablishedStates.ONGOING,
            },
          },
        },
        [EstablishedStates.MUTED]: {
          on: {
            [EstablishedActions.UN_MUTE]: {
              guard: 'isRegistered',
              target: EstablishedStates.ONGOING,
            },
          },
        },
      },
    },
    [States.TERMINATED]: { },
  },
});

export type CallActorRef = ActorRefFrom<typeof callMachine>;

export default callMachine;
