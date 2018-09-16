import axios from 'axios';

import logIn from '../../../../src/api/auth/log-in';
import wazo from '../../../../src/config';
import version from '../../../../src/api/auth/version';

const mockedResponse = { data: { data: { token: 1 } } };

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve(mockedResponse)),
}));

it("should call wazo's token API with default values", () => {
  const defaultServer = null;
  const defaultVersion = '0.1';
  const data = { backend: 'wazo_user', expiration: 3600 };
  const config = { auth: { username: undefined, password: undefined } };

  logIn();

  expect(axios.post).toBeCalledWith(
    `https://${defaultServer}/api/auth/${defaultVersion}/token`,
    data,
    config,
  );
});

it("should call wazo's token API with given values", () => {
  const data = { backend: 'localhost', expiration: 100 };
  const config = { auth: { username: 'manu', password: 'unam' } };

  logIn({
    expiration: data.expiration,
    backend: data.backend,
    username: config.auth.username,
    password: config.auth.password,
  });

  expect(axios.post).toBeCalledWith(
    `https://${wazo.server}/api/auth/${version}/token`,
    data,
    config,
  );
});
