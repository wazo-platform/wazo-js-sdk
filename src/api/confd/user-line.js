import axios from 'axios';

import wazo from '../../config';
import version from './version';

const handleResponse = (response, callback) => {
  wazo.data = response.data;

  if (callback) {
    callback(wazo.data);
  }
};

export default params => {
  const url = `https://${wazo.server}/api/confd/${version}/users/${params.user_uuid}/lines/${
    params.line_id
  }/associated/endpoints/sip`;
  const config = {
    headers: {
      'X-Auth-Token': params.token,
      'Content-Type': 'application/json'
    }
  };

  axios.get(url, config).then(response => handleResponse(response, params.callback));
};
