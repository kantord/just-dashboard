const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const env = process.env.WEBPACK_ENV;
const libraryName = 'dashboard';

let plugins = [];
let outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "lib"),
    compress: true,
    port: 9000
  },
  entry: ['babel-polyfill', __dirname + '/src/index.js'],
  target: 'web',
  devtool: 'source-map',
  node: {
    fs: 'empty'
  },
  output: {
    filename: 'dashboard.js',
    chunkFilename: '[name].bundle.js',
    library: 'dashboard',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    path: path.resolve(__dirname, 'lib')
  },
  plugins: plugins,
  module: {
    rules: [
      {
		test: /\.s?css$/,
		use: [{
			loader: "style-loader" // creates style nodes from JS strings
		}, {
			loader: "css-loader" // translates CSS into CommonJS
		}, {
			loader: "sass-loader" // compiles Sass to CSS
		}]
	  },
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      }
    ]
  }
};
