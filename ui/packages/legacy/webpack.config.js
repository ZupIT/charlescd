const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  mode: 'development',

  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
    port: 3001,
  },

  entry: {
    vendor: ['react', 'react-dom'],
    regenerator: 'regenerator-runtime/runtime',
    app: './src/index.jsx',
  },

  devtool: 'cheap-module-source-map',

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
  },

  optimization: {
    namedModules: true,
    splitChunks: {
      chunks: 'all',
    },
  },

  performance: {
    hints: false,
  },

  resolve: {
    alias: {
      animations: path.resolve(__dirname, './src/animations'),
      core: path.resolve(__dirname, './src/core'),
      containers: path.resolve(__dirname, './src/containers'),
      components: path.resolve(__dirname, './src/components'),
      routes: path.resolve(__dirname, './src/routes'),
      stream: path.resolve(__dirname, './src/stream'),
    },
    extensions: ['.jsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true,
            },
          },
        ],
      },
      {
        test: /\.(png|woff|woff2|ttf|eot|jpg)/,
        use: 'file-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['lodash'],
            presets: [['@babel/preset-env', { modules: false }]],
          },
        },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new LodashModuleReplacementPlugin({
      collections: true,
    }),
    new HtmlWebpackPlugin({
      title: 'Charles C.D.',
      template: './src/index.ejs',
      favicon: './src/core/assets/img/favicon.ico',
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
      },
    }),
    new CompressionPlugin({
      test: /\.js$|\.css$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
    }),
  ],
}
