import axios from 'axios';

import wazo from '../../config';
import version from './version';

const handleResponse = (response, callback) => {
  wazo.data = response.data;

  if (response === 404) {
    wazo.data = {
      error: 'Token is not found',
    };
  }

  if (response === 204) {
    wazo.data = {
      message: 'Token is found',
    };
  }

  if (callback) {
    callback(wazo.data);
  }
};

export default (params) => {
  const url = `https://${wazo.server}/api/auth/${version}/token/${params.token}`;

  axios.head(url, {
    validateStatus: (status) => {
      handleResponse(status, params.callback);
    },
  })
    .then(response => handleResponse(response, params.callback))
    .catch(error => handleResponse(error, params.callback));
};
