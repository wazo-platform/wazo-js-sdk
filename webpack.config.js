const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'wazo-sdk.js',
    library: '@wazo/sdk',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
  externals: ['axios', 'sip.js', 'reconnecting-websocket'],
};
