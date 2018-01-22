const webpack = require('webpack');
const GoogleFontsPlugin = require("google-fonts-webpack-plugin")
const path = require('path');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const env = process.env.WEBPACK_ENV;
const libraryName = 'dashboard';

let plugins = [
    new GoogleFontsPlugin({
      fonts: [
        { family: "Libre Baskerville", variants: ["400", "400i", "700"] },
        { family: "Merriweather", variants: ["300", "300i", "400", "400i", "700", "700i", "900", "900i"] },
      ],
      local: true
    })
  ];
let outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

module.exports = {
  entry: __dirname + '/src/index.js',
  target: 'web',
  devtool: 'source-map',
  node: {
    fs: 'empty'
  },
  output: {
    filename: 'dashboard.js',
    library: 'dashboard',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    path: path.resolve(__dirname, 'lib')
  },
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        loader: "file-loader",
        options: {
          name: "fonts/[name].[ext]",
        },
      },
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
