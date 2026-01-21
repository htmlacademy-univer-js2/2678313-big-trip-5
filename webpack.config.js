const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.[contenthash].js',
    clean: true,
  },

  devtool: 'source-map',

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public',
          to: '.',
          globOptions: {
            ignore: ['**/index.html'],
          }
        },
      ],
    }),

    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
    ],
  },
};
