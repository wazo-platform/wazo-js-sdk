export const camelToUnderscore = (key: string) => {
  if (typeof key !== 'string') {
    throw new Error('Input is not a string');
  }

  return key.charAt(0).toLowerCase() + key.substring(1).replace(/([A-Z])/g, '_$1').toLowerCase();
};
