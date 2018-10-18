import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import flow from 'rollup-plugin-flow';

export default {
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
      include: ['node_modules/**'],
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      }
    }),
    commonjs(),
    terser(),
  ]
};
