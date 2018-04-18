var path = require("path");

const production = process.env.NODE_ENV === "production";
const options = {};

options.webpackMode = production ? "production" : "development";
options.outputDir = production ? "dist" : "devDist";

module.exports = {
  entry: {
   "demo/demo": "./src/demo/demo.js"
  },
  
  output: {
    path: path.resolve(__dirname, options.outputDir),
    filename: "[name].bundle.js",
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
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" 
          }, {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          }, {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
};