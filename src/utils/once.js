// @flow
/* eslint-disable */
// Can't use arrow function here due to `apply`
export default function(func: ?Function) {
  let ran = false;
  let memo;
  return function() {
    if (ran) return memo;
    ran = true;
    memo = func && func.apply(this, arguments);
    func = null;
    return memo;
  };
}
