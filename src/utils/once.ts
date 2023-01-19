/* eslint-disable */
// Can't use arrow function here due to `apply`
export default function (func: ((...args: Array<any>) => any) | null | undefined) {
  let ran = false;
  let memo: any;
  return function () {
    if (ran) return memo;
    ran = true;
    // @ts-ignore
    memo = func && func.apply(this, arguments);
    func = null;
    return memo;
  };
}