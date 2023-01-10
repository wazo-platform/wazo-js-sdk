if (typeof (window) === 'undefined') {
  global.window = {
    // @ts-ignore
    navigator: {},
    // @ts-ignore
    removeEventListener: {},
    // @ts-ignore
    addEventListener: {},
  };
} else {
  window.global = window.global || window;
}
