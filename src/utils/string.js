// @flow

export const camelToUnderscore = (key: string) => key.replace(/([A-Z])/g, '_$1').toLowerCase();
