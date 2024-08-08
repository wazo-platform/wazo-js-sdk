import { type SnapshotFrom } from 'xstate';
import { type SoftphoneActorRef, type ActionTypes as SoftphoneActions, type StateTypes as SoftphoneStates } from './softphone-state-machine';
import { type CallActorRef, type ActionTypes as CallActions, type EstablishedActionTypes as EstablishedCallActions, type StateTypes as CallStates, type EstablishedStateTypes } from './call-state-machine';

import InvalidStateTransition from '../domain/InvalidStateTransition';
import InvalidState from '../domain/InvalidState';
import IssueReporter from '../service/IssueReporter';

const logger = IssueReporter.loggerFor('state-machine');

export const getState = (actor: SoftphoneActorRef | CallActorRef): SoftphoneStates | CallStates | EstablishedStateTypes | Record<CallStates, EstablishedStateTypes> => {
  return actor.getSnapshot().value as SoftphoneStates | CallStates | EstablishedStateTypes | Record<CallStates, EstablishedStateTypes>;
};

export const can = (actor: SoftphoneActorRef | CallActorRef, action: SoftphoneActions | CallActions | EstablishedCallActions): boolean => {
  return actor.getSnapshot().can({ type: action });
};

export const hasState = (actor: SoftphoneActorRef | CallActorRef, state: SoftphoneStates | CallStates, innerState?: EstablishedStateTypes): boolean => {
  const currentState = getState(actor);

  // When using nested states, we'll have an object here
  if (typeof currentState === 'object') {
    return innerState ? state in currentState && currentState[state as CallStates] === innerState : state in currentState;
  }

  return currentState === state;
};

export const waitUntilState = (actor: SoftphoneActorRef | CallActorRef, state: SoftphoneStates | CallStates, timeout = 5000): Promise<unknown> => {
  return Promise.race([
    new Promise(resolve => {
      (actor as SoftphoneActorRef).subscribe((snapshot: SnapshotFrom<SoftphoneActorRef | CallActorRef>) => {
        if (snapshot.value === state) {
          resolve(null);
        }
      });
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Waited for state ${state} timeout.`)), timeout)),
  ]);
};

export const assertCan = (actor: SoftphoneActorRef | CallActorRef, action: SoftphoneActions | CallActions | EstablishedCallActions): void => {
  if (!can(actor, action)) {
    const currentState = actor.getSnapshot().value;
    const message = `Invalid state transition from ${currentState} with action ${action}`;
    logger.warn(message);

    throw new InvalidStateTransition(message, action, currentState as string);
  }
};

export const assertState = (actor: SoftphoneActorRef | CallActorRef, state: SoftphoneStates | CallStates): void => {
  if (!hasState(actor, state)) {
    const message = `Invalid state ${state}, has state ${getState(actor)}`;
    logger.warn(message);

    throw new InvalidState(message, state);
  }
};
