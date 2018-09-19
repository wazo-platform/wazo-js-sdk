import axios from 'axios';

import logOut from '../../../../src/api/auth/log-out';
import wazo from '../../../../src/config';

jest.mock('axios', () => ({
  delete: jest.fn(() => Promise.resolve())
}));

it('should call the callback even if no token is specified', () => {
  let exptectedError = null;

  logOut({
    callback: err => {
      exptectedError = err;
    }
  });

  expect(exptectedError).not.toBeNull();
});

it('should delete the specified token', () => {
  const defaultServer = null;
  const defaultVersion = '0.1';
  wazo.token = 1;
});
