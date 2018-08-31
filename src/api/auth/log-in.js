import axios from 'axios';

import wazo from '../../config';
import apiInfos from '.';

const DEFAULT_BACKEND = 'wazo_user';
const DEFAULT_EXPIRATION = 3600;

const handleResponse = (response, callback = () => {}) => {
  wazo.data = response.data.data;

  if (callback) {
    callback(wazo.data);
  }
};

export default (params = {}) => {
  const url = `https://${wazo.server}${apiInfos.path}`;
  const data = {
    backend: params.backend || DEFAULT_BACKEND,
    expiration: params.expiration || DEFAULT_EXPIRATION,
  };
  const config = {
    auth: {
      username: params.username,
      password: params.password,
    },
  };

  axios.post(url, data, config)
    .then(response => handleResponse(response, params.callback));
};
