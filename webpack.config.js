var path = require("path");

const production = process.env.NODE_ENV === "production";
const options = {};

options.webpackMode = production ? "production" : "development";
options.outputName = production ? "[name].bundle.js" : "[name].dev.bundle.js";

module.exports = {
  entry: {
   caLINEdar: "./src/caLINEdar.js",
  },
  
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: options.outputName,
  },

  mode: options.webpackMode,

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["transform-class-properties", "transform-runtime", "babel-plugin-transform-regenerator"],
            presets: ['babel-preset-env'],
          }
        }
      },
    ]
  }
};