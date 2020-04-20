const path = require('path')
const merge = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin')
const common = require('./webpack.config')

const basePackageValues = {
  name: 'moove-dist',
  version: '1.0.0',
  main: './server.js',
  engines: {
    node: '<= 6.9.1',
  },
  scripts: {
    start: 'node ./server.js',
  },
  dependencies: {
    chalk: '^2.4.2',
    compression: '^1.7.4',
    consul: '^0.35.0',
    express: '^4.17.1',
  },
}

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/',
  },

  optimization: {
    namedModules: true,
    concatenateModules: true,
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: false,
      }),
    ],
  },

  devtool: false,
  plugins: [
    new CopyPlugin([
      { from: './nginx.conf', to: './' },
    ]),
    new GeneratePackageJsonPlugin(
      basePackageValues,
      './package.json',
    ),
  ],
})
