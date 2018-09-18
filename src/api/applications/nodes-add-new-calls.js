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
  const url = `https://${wazo.server}/api/ctid-ng/${version}/applications/${params.applicationUuid}/nodes/${
    params.nodeUuid
  }/calls`;
  const config = {
    headers: {
      'X-Auth-Token': params.token,
      'Content-Type': 'application/json'
    }
  };

  const data = {
    context: params.context,
    exten: params.exten,
    autoanswer: params.autoanswer
  };

  axios.post(url, data, config).then(response => handleResponse(response, params.callback));
};
