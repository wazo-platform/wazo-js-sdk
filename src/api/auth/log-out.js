import axios from 'axios';

import wazo from '../../config';
import version from './version';

const handleResponse = (callback) => {
  wazo.token = null;

  if (callback) {
    callback(wazo.token);
  }
};

export default (params) => {
  if (wazo.token) {
    const url = `https://${wazo.server}/api/auth/${version}/token/${wazo.token}`;

    axios.delete(url)
      .then(handleResponse(params.callback));
  }
};
