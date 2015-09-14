var path = require('path');
var webpack = require('webpack');
var TARGET = process.env.TARGET || null;

var config = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'react-motion-slider.js',
    sourceMapFilename: 'react-motion-slider.sourcemap.js',
    library: 'ReactMotionSlider',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {test: /\.(js|jsx)/, loader: 'babel?stage=0'}
    ]
  },
  plugins: [],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  externals: {
    'react': 'React',
    'react-motion': 'ReactMotion'
  },
};

if(TARGET === 'minify') {
  config.output.filename = 'react-motion-slider.min.js';
  config.output.sourceMapFilename = 'react-motion-slider.min.js';
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    mangle: {
      except: ['React', 'Spring', 'Slider']
    }
  }));
}

module.exports = config;