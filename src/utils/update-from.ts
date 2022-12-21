/* eslint-disable no-param-reassign */
export default ((instance: any, from: any) => {
  Object.keys(from).forEach(key => {
    if (!instance[key] && from[key] || typeof instance[key] !== 'undefined' && typeof from[key] !== 'undefined' && instance[key] !== from[key]) {
      instance[key] = from[key];
    }
  });
});
