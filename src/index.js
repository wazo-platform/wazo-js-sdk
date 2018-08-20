import client from './application';
import init from './config/init';
import logIn from './api/auth/log-in';
import logOut from './api/auth/log-out';

import calls from './api/applications/calls';

export default {
  client,
  init,
  logIn,
  logOut,
  calls,
};
