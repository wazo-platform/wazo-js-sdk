class InvalidStateTransition extends Error {

  state: string;

  action: string;

  constructor(message: string, action: string, state: string) {
    super(message);

    this.action = action;

    this.state = state;
  }

}

export default InvalidStateTransition;
