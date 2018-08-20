import axios from 'axios';

import wazo from '../../config';
import version from './version';

const handleResponse = (response, callback) => {
  wazo.data = response.data;

  if (callback) {
    callback(wazo.data);
  }
};

export default (token, applicationsUuid, callback) => {
  const url = `https://${wazo.server}/api/ctid-ng/${version}/applications/${applicationsUuid}/calls`;
  const config = {
    headers: {
      'X-Auth-Token': token,
      'Content-Type': 'application/json',
    },
  };

  axios.get(url, config)
    .then(response => handleResponse(response, callback));
};
