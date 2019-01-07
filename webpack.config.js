const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'wazo-sdk.js',
    library: '@wazo/sdk',
    libraryTarget: 'umd',
    libraryExport: 'default',
    // Workaround for webpack 4 umd bug (@see: https://github.com/webpack/webpack/issues/6522)
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  module: {
    rules: [
      {
          test: /\.jsx?$/,
          enforce: "pre",
          use: ["remove-flow-types-loader"],
          include: path.join(__dirname, "src")
      },
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
        use: []
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^encoding$/, /node-fetch/),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': `"${process.env.NODE_ENV}"`,
        'DEBUG': `"${process.env.DEBUG}"`
      }
    })
  ],

  devtool: 'source-map'
};
