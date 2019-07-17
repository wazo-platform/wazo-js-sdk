// @flow

import CallSession from './CallSession';

export type IndirectTransferArguments = {
  destinationId: string,
  sourceId: string,
};

export default class IndirectTransfer {
  sourceId: string;

  destinationId: string;

  constructor({ sourceId, destinationId }: IndirectTransferArguments) {
    this.sourceId = sourceId;
    this.destinationId = destinationId;
  }

  static parseFromCallSession(source: CallSession, destination: CallSession) {
    return new IndirectTransfer({
      sourceId: source.getId(),
      destinationId: destination.getId(),
    });
  }

  destinationIs(callSession: CallSession): boolean {
    return callSession.isId(this.destinationId);
  }

  sourceIs(callSession: CallSession): boolean {
    return callSession.isId(this.sourceId);
  }
}
