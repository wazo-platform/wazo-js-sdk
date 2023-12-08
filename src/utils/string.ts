export const camelToUnderscore = (key: string): string => {
  if (typeof key !== 'string') {
    throw new Error('Input is not a string');
  }

  return key.charAt(0).toLowerCase() + key.substring(1).replace(/([A-Z])/g, '_$1').toLowerCase();
};

export const obfuscateToken = (token: string | null | undefined) => {
  if (!token) {
    return token;
  }

  return token.split('-').map((part, index) => (index === 0 ? part : 'xxxxxx')).join('-');
};
