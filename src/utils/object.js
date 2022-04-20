// @flow

import { camelToUnderscore } from './string';

export const convertKeysFromCamelToUnderscore = (args: Object) =>
  Object.keys(args).reduce((acc, key) => {
    acc[camelToUnderscore(key)] = args[key];
    return acc;
  }, {});
