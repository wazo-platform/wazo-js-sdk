import globby from 'globby';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import flow from 'rollup-plugin-flow';

const configs = globby.sync('src/**/*.js').map(inputFile => ({
  entry: inputFile,
  dest: inputFile.replace('src', 'esm'),
  format: 'esm',
  plugins: [
    flow(),
  ]
}));

configs.push({
  input: 'src/index.js',
  output: {
    file: 'dist/wazo-sdk.js',
    format: 'umd',
    name: '@wazo/sdk',
    sourcemap: true
  },
  plugins: [
    flow(),
    resolve({
      jsnext: true,
      main: false,
      browser: true,
      include: ['node_modules/**'],
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      }
    }),
    json(),
    commonjs(),
    terser(),
  ],
  moduleContext: { 'node_modules/node-fetch/lib/index': 'window' },
});

export default configs;
