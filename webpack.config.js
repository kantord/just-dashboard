const webpack = require('webpack');
const path = require('path');
const env = process.env.WEBPACK_ENV;
const libraryName = 'dashboard';

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },
  entry: ["@babel/polyfill", './src/index.js'],
  target: 'web',
  mode: 'production',
  node: {
    fs: 'empty'
  },
  output: {
    filename: 'dashboard.js',
    chunkFilename: '[name].bundle.js',
    library: 'dashboard',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    path: path.resolve(__dirname, 'dist')
  },
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
		}, {
            loader: "postcss-loader"
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
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
