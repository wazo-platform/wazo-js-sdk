import axios from 'axios';

import wazo from '../../config';
import apiInfos from '.';
import { promiseAndCallback } from '../../utils';

const DEFAULT_BACKEND = 'wazo_user';
const DEFAULT_EXPIRATION = 3600;

// Supports callback or promise
export default (params = {}, cb = null) => {
  const url = `https://${wazo.server}${apiInfos.path}`;
  const data = {
    backend: params.backend || DEFAULT_BACKEND,
    expiration: params.expiration || DEFAULT_EXPIRATION
  };
  const config = {
    auth: {
      username: params.username,
      password: params.password
    },
    validateStatus: status => status < 400 // Throw exception on unsuccessful login
  };

  const promise = axios.post(url, data, config);

  return promiseAndCallback(promise, cb, response => response.data.data);
};
