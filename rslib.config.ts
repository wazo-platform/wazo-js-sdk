import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      bundle: true,
      dts: true,
      format: 'esm',
      output: { target: 'web' },
    },

    {
      bundle: true,
      dts: false,
      format: 'cjs',
      source: { tsconfigPath: './tsconfig.cjs.json' },
      output: { target: 'web' },
    },

    {
      bundle: true,
      dts: false,
      format: 'umd',
      output: { distPath: { root: 'dist' }, filename: { js: 'wazo-sdk.js' }, target: 'web' },
    },
  ],
});
