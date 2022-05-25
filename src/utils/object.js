// @flow

import { camelToUnderscore } from './string';

export const convertKeysFromCamelToUnderscore = (args: Object) => {
  if (typeof args !== 'object') {
    throw new Error('Input is not an object');
  }

  return Object.keys(args).reduce((acc, key) => {
    acc[camelToUnderscore(key)] = typeof args[key] === 'object' && !Array.isArray(args[key])
      ? convertKeysFromCamelToUnderscore(args[key]) : args[key];
    return acc;
  }, {});
};
