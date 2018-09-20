const path = require('path');

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
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  devtool: 'source-map',
  externals: ['cross-fetch', 'sip.js', 'reconnecting-websocket', 'js-base64'],
};
