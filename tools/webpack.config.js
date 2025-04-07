/**
 * @file
 * Webpack file for compiling JS and CSS files.
 */

const webpack = require('webpack');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const entries = require('./glob-files');
const { staticEntries } = require('./config');

const entryPoints = {
  ...staticEntries,
  ...entries,
};



const compiledEntries = {};

for (const prop in entryPoints) {
  compiledEntries[prop] = entryPoints[prop];
}

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    context: __dirname,
    entry: compiledEntries,
    stats: 'errors-details',
    // stats: 'errors-warnings',
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].js',
      assetModuleFilename: 'assets/[name][ext]'
    },

    externals: {
      jquery: 'jQuery',
    },

    cache: {
      type: 'filesystem',
      compression: 'gzip',
    },

    // cache: false,

    experiments: {
      backCompat: false,
    },

    devtool: isDev ? 'inline-source-map' : 'source-map',

    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      }),
      new RemoveEmptyScriptsPlugin(),
      new MiniCssExtractPlugin({ filename: '[name].css' }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          // Must add exceptions to this exclude statement for
          // anything that needs to be transpiled by babel.
          exclude: [/node_modules\/(?!foundation-sites)/],
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['> 1%', 'last 2 versions', 'ie 11'],
                  },
                }],
              ],
              plugins: [
                'babel-plugin-array-includes',
                '@babel/plugin-proposal-class-properties',
              ],
            },
          },
        },
        {
          test: /\.(png|jpg|gif|woff2?|ttf|otf|eot|svg)$/,
          exclude: '/node_modules/',
          type: 'asset/resource',
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [{
            loader: MiniCssExtractPlugin.loader,
          }, {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: isDev,
            },
          }, {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDev,
            },
          }, {
            loader: 'sass-loader',
            options: {
              additionalData: '@import "./index";',
              sassOptions: {
                includePaths: [
                  path.resolve(__dirname, '../node_modules/foundation-sites/scss'),
                  path.resolve(__dirname, '../source/00-config'),
                    'node_modules'
                ],
              },
              sourceMap: isDev,
            },
          }],
        },
      ],
    },
  };
};
