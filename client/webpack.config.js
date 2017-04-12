var path = require('path');

module.exports = {
  entry: "./app/app.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devtool: 'source-map',
  module : {
    loaders : [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};
