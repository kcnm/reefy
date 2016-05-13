var webpack = require('webpack');
var path = require('path');

var APP_DIR = path.resolve(__dirname, 'src/app');
var DIST_DIR = path.resolve(__dirname, 'dist');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
};

module.exports = config;
