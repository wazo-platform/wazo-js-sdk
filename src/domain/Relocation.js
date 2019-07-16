// @flow

export type RelocationResponse = {
  completions: Array<string>,
  initiator: string,
  initiator_call: string,
  recipient_call: string,
  relocated_call: string,
  timeout: number,
};

type RelocationArguments = {
  initiatorCall?: string,
  recipientCall?: ?string,
  relocatedCall?: ?string,
};

class Relocation {
  static MIN_ENGINE_VERSION_REQUIRED: string;

  relocatedCall: string;

  initiatorCall: string;

  recipientCall: string;

  static parse(response: RelocationResponse) {
    return new Relocation({
      initiatorCall: response.initiator_call,
      recipientCall: response.recipient_call,
      relocatedCall: response.relocated_call,
    });
  }

  constructor({ relocatedCall, initiatorCall, recipientCall }: RelocationArguments) {
    this.initiatorCall = initiatorCall || '';
    this.relocatedCall = relocatedCall || '';
    this.recipientCall = recipientCall || '';
  }
}

Relocation.MIN_ENGINE_VERSION_REQUIRED = '19.09';

export default Relocation;
