// @flow
export const lastIndexOf = (array: any[], method: Function): number => {
  const start = array.length - 1;

  for (let i = start; i >= 0; i--) {
    if (method(array[i])) {
      return i;
    }
  }
  return -1;
};
