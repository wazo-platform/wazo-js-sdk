import axios from 'axios';

import wazo from '../../config';
import apiInfos from '.';

export default (token, cb = null) => {
  if (!token) {
    return cb("No Wazo's token specified to logout.");
  }

  const url = `https://${wazo.server}${apiInfos.path}/${wazo.token}`;

  return axios
    .delete(url)
    .then(() => {
      if (cb) {
        cb(null);
      }

      return null;
    })
    .catch(err => {
      if (cb) {
        return cb(err);
      }

      throw err;
    });
};
