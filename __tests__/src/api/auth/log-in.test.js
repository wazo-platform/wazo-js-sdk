import axios from 'axios';
import logIn from '../../../../src/api/auth/log-in';

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
