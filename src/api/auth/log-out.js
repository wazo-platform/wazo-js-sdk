import axios from 'axios';

import wazo from '../../config';
import apiInfos from '.';

const handleResponse = (callback = () => {}) => {
  wazo.token = null;

  callback(null, wazo.token);
};

export default (params = { callback: () => {} }) => {
  if (!wazo.token) {
    return params.callback("No Wazo's token specified.");
  }

  const url = `https://${wazo.server}${apiInfos.path}/${wazo.token}`;

  return axios.delete(url).then(handleResponse(params.callback));
};
