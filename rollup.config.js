import globby from 'globby';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const configs = [];

const plugins = [
  typescript(),
  json(),
  resolve({
    preferBuiltins: false,
  }),
  commonjs(),
];

if (!process.env.DEV) {
  plugins.push(terser());
}

configs.push({
  input: 'src/index.ts',
  output: {
    file: 'dist/wazo-sdk.js',
    format: 'umd',
    name: '@wazo/sdk',
    sourcemap: true,
    intro: `
if (typeof(window) === 'undefined') {
  global.window = {
    navigator: {},
    removeEventListener: {},
    addEventListener: {},
  };
} else {
  window.global = window.global || window;
}
    `,
  },
  plugins,
  moduleContext: { 'node_modules/node-fetch/lib/index': 'window' },
});

export default configs;
