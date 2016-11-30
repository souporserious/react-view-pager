var path = require('path');
var webpack = require('webpack');
var banner = require('./webpack.banner');
var TARGET = process.env.TARGET || null;

var externals = {
  'react': {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react'
  },
  'react-dom': {
    root: 'ReactDOM',
    commonjs2: 'react-dom',
    commonjs: 'react-dom',
    amd: 'react-dom'
  },
  'react-motion': {
    root: 'ReactMotion',
    commonjs2: 'react-motion',
    commonjs: 'react-motion',
    amd: 'react-motion'
  },
  'resize-observer-polyfill': {
    root: 'ResizeObserver',
    commonjs2: 'resize-observer-polyfill',
    commonjs: 'resize-observer-polyfill',
    amd: 'resize-observer-polyfill'
  },
  'get-prefix': {
    root: 'getPrefix',
    commonjs2: 'get-prefix',
    commonjs: 'get-prefix',
    amd: 'get-prefix'
  }
};

var config = {
  entry: {
    index: './src/react-view-pager.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'react-view-pager.js',
    sourceMapFilename: 'react-view-pager.sourcemap.js',
    library: 'ReactViewPager',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.(js|jsx)/, loader: 'babel-loader' }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(banner)
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  externals: externals
};

if (TARGET === 'minify') {
  config.output.filename = 'react-view-pager.min.js';
  config.output.sourceMapFilename = 'react-view-pager.min.js';
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    mangle: {
      except: ['React', 'ReactDOM', 'ReactMotion', 'ReactViewPager']
    }
  }));
}

module.exports = config;
