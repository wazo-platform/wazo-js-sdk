import axios from 'axios';

import wazo from '../../config';
import version from './version';

const handleResponse = (response, callback) => {
  wazo.data = response.data;

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
      const url2 = `https://${wazo.server}/api/ctid-ng/${version}/applications/${params.applicationUuid}/nodes/${nodeUuid}/calls`;
      const data2 = {
        context: 'default',
        exten: '8000',
        autoanswer: true,
      };

      axios.post(url2, data2, config)
        .then((response) => {
          console.log(response);
          handleResponse(response, params.callback);
        });
    });

// .then(response => handleResponse(response, params.callback))
};
