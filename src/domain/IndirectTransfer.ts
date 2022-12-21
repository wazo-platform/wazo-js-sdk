import CallSession from "./CallSession";
import newFrom from "../utils/new-from";
import updateFrom from "../utils/update-from";
export type IndirectTransferArguments = {
  status?: string;
  id?: string;
  destinationId: string;
  sourceId: string;
};
type Reponse = {
  id: string;
  initiator_uuid: string;
  transferred_call: string;
  initiator_call: string;
  recipient_call: string;
  status: string;
  flow: string;
};
export default class IndirectTransfer {
  status: string | null | undefined;
  id: string | null | undefined;
  sourceId: string;
  destinationId: string;

  constructor({
    sourceId,
    destinationId,
    status,
    id
  }: IndirectTransferArguments) {
    this.sourceId = sourceId;
    this.destinationId = destinationId;
    this.status = status;
    this.id = id;
  }

  static parseFromCallSession(source: CallSession, destination: CallSession) {
    return new IndirectTransfer({
      sourceId: source.getId(),
      destinationId: destination.getId()
    });
  }

  static parseFromApi(plain: Reponse) {
    return new IndirectTransfer({
      id: plain.id,
      status: plain.status,
      sourceId: plain.initiator_call,
      destinationId: plain.recipient_call
    });
  }

  destinationIs(callSession: CallSession): boolean {
    return callSession.isId(this.destinationId);
  }

  sourceIs(callSession: CallSession): boolean {
    return callSession.isId(this.sourceId);
  }

  updateFrom(indirectTransfer: IndirectTransfer) {
    updateFrom(this, indirectTransfer);
  }

  static newFrom(indirectTransfer: IndirectTransfer) {
    return newFrom(indirectTransfer, IndirectTransfer);
  }

}