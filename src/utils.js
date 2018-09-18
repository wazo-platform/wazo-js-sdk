export const promiseAndCallback = (promise, cb, parse = response => response) =>
  promise
    .then(response => {
      const result = parse(response);

      if (cb) {
        cb(null, result);
      }

      return result;
    })
    .catch(err => {
      if (cb) {
        return cb(err);
      }

      throw err;
    });
