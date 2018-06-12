import logIn from './api/auth/log-in';
import logOut from './api/auth/log-out';

export default class {
  constructor(server) {
    this.logIn = logIn;
    this.logOut = logOut;

    this.server = server;
  }
}
