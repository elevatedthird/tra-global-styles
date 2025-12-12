const path = require('path');
const fs = require('fs');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');


module.exports = {
  entry: {
    'css/global': './src/01-global/scss/global.scss',
    'css/utilities': './src/01-global/scss/utilities.scss',
  },
  context: __dirname,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[name][ext]'
  },
  cache: {
    type: 'filesystem',
    compression: 'gzip',
  },
  experiments: {
    backCompat: false,
  },
  optimization: {
    splitChunks: false
  },
  module: {
    rules: [
      {
        test: /\.(svg)$/,
        exclude: '/node_modules/',
        type: 'asset/inline',
      },
      {
        test: /\.(png|jpg|gif|woff2?|ttf|otf|eot)$/,
        exclude: '/node_modules/',
        type: 'asset/resource',
      },
      {
        test: /\.es6.js\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: '@import "./src/00-config/_index.scss";',
              sassOptions: {
                includePaths: [
                  path.resolve(__dirname, 'src/00-config'),
                  path.resolve(__dirname, 'node_modules/foundation-sites/scss'),
                ],
              },
            },
          }
        ]
      }
    ]
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  devtool: 'source-map',
  mode: 'development'
};
