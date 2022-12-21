export const lastIndexOf = (array: any[], method: (...args: Array<any>) => any): number => {
  const start = array.length - 1;

  for (let i = start; i >= 0; i--) {
    if (method(array[i])) {
      return i;
    }
  }

  return -1;
};