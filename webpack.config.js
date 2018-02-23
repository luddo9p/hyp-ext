const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: ['babel-polyfill', './src/js/main.js'],
  watch: true,
  output: {
    path: path.resolve(__dirname, ''),
    filename: './src/export/main.bundle.js'
  },
  // plugins: [
  //   new UglifyJsPlugin({
  //     sourceMap: true,
  //     test: /\.js($|\?)/i
  //   })
  // ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // eslint options (if necessary)
        }
      }
    ]
  }
}
