import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import flow from 'rollup-plugin-flow';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/wazo-sdk.js',
    format: 'umd',
    name: '@wazo/sdk',
    globals: {
      'sip.js': 'SIP',
      'cross-fetch': 'cross-fetch',
      'reconnecting-websocket': 'ReconnectingWebSocket',
    },
  },
  plugins: [
    flow(),
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    // terser(),
  ],
  external: ['cross-fetch/polyfill', 'sip.js', 'reconnecting-websocket', 'js-base64'],
};
