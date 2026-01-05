const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    background: './src/background/service-worker.js',
    content: './src/content/content.js',
    popup: './src/popup/popup.js',
    options: './src/options/options.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: '.' },
        { from: 'assets', to: 'assets' },
        { from: 'src/popup/popup.html', to: 'src/popup' },
        { from: 'src/popup/popup.css', to: 'src/popup' },
        { from: 'src/options/options.html', to: 'src/options' },
        { from: 'src/options/options.css', to: 'src/options' },
        { from: 'src/content/content.css', to: 'src/content' }
      ]
    })
  ],
  devtool: 'source-map'
};