const GoogleFontsPlugin = require("google-fonts-webpack-plugin")
const path = require('path');

module.exports = {
  entry: './src/index.js',
  target: 'web',
  devtool: 'source-map',
  node: {
    fs: 'empty'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new GoogleFontsPlugin({
      fonts: [
        { family: "Libre Baskerville", variants: ["400", "400i", "700"] },
        { family: "Merriweather", variants: ["300", "300i", "400", "400i", "700", "700i", "900", "900i"] },
      ],
      local: true
    })
  ],
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
