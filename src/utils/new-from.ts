export default ((instance: any, ToClass: any) => {
  const args: Record<string, any> = {};
  Object.getOwnPropertyNames(instance).forEach(prop => {
    args[prop] = instance[prop];
  });
  return new ToClass(args);
});
