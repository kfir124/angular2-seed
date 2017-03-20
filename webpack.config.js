var webpack = require('webpack');
var path = require('path');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var extractSCSS = new ExtractTextPlugin('main.css');
var extractHTML = new ExtractTextPlugin('index.html');

// Webpack Config
var webpackConfig = {
  entry: {
    'main': './src/main.browser.ts',
    'indexHtml': './src/index.html',
    'mainScss': './src/css/main.scss'
  },

  output: {
    publicPath: '',
    path: path.resolve(__dirname, './dist'),
  },

  plugins: [
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
      path.resolve(__dirname, './src'),
      {
        // your Angular Async Route paths relative to this root directory
      }
    ),
    extractSCSS,
    extractHTML
  ],

  module: {
    loaders: [
      // .ts files for TypeScript
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader',
          'angular2-router-loader'
        ]
      },
      // sass / css files
      { test: /\.scss$/, exclude: /node_modules|main\.scss/, loaders: ['to-string-loader', 'css-loader', 'sass-loader'] },
      { test: /main\.scss$/, exclude: /node_modules/, loader: extractSCSS.extract({use: ['css-loader', 'sass-loader']}) },
      { test: /\.css$/, exclude: /node_modules/, loaders: ['to-string-loader', 'css-loader'] },
      // html files
      { test: /\.html$/, exclude: /node_modules|index\.html/, loader: 'html-loader' },
      { test: /index\.html$/, exclude: /node_modules/, loader: extractHTML.extract({use: ['html-loader']}) },
      // font-awesome
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?name=fonts/[name].[ext]&limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=fonts/[name].[ext]'},
    ]
  }

};


// Our Webpack Defaults
var defaultConfig = {
  devtool: 'source-map',

  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: [ '.ts', '.js' ],
    modules: [ path.resolve(__dirname, 'node_modules') ]
  },

  devServer: {
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },

  node: {
    global: true,
    crypto: 'empty',
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false,
    clearImmediate: false,
    setImmediate: false
  }
};


module.exports = webpackMerge(defaultConfig, webpackConfig);
