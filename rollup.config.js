import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
// import { uglify } from 'rollup-plugin-uglify';

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
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    terser(),
  ],
  external: ['cross-fetch', 'sip.js', 'reconnecting-websocket', 'js-base64'],
};
