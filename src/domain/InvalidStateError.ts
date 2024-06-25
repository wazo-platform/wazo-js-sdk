class InvalidStateError extends Error {
  constructor(message, state, currentState) {
      super(message);
  }
}

export default InvalidStateError;