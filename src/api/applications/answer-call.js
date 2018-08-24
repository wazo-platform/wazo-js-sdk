import axios from 'axios';

import wazo from '../../config';
import version from './version';

const handleResponse = (response, nodeUuid, callback) => {
  wazo.data = response.data;
  wazo.data.node_uuid = nodeUuid;

  if (callback) {
    callback(wazo.data);
  }
};

export default (params) => {
  const url = `https://${wazo.server}/api/ctid-ng/${version}/applications/${params.applicationUuid}/nodes`;

  const data = {
    calls: [
      {
        id: params.callID,
      },
    ],
  };
  const config = {
    headers: {
      'X-Auth-Token': params.token,
      'Content-Type': 'application/json',
    },
  };

  axios.post(url, data, config)
    .then((res) => {
      const nodeUuid = res.data.uuid;
      const call = {
        context: 'default',
        exten: '8000',
        autoanswer: true,
      };

      axios.post(`${url}/${nodeUuid}/calls`, call, config)
        .then((response) => {
          handleResponse(response, nodeUuid, params.callback);
        });
    });
};
