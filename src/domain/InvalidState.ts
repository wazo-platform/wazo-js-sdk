class InvalidState extends Error {

  state: string;

  constructor(message: string, state: string) {
    super(message);

    this.state = state;
  }

}

export default InvalidState;
