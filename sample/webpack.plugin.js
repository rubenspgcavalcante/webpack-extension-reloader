const { resolve } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackReloaderPlugin = require("../dist/webpack-extension-reloader");

const mode = process.env.NODE_ENV;
module.exports = {
  mode,
  devtool: "inline-source-map",
  entry: {
    "content-script": "./sample/plugin-src/my-content-script.js",
    background: "./sample/plugin-src/my-background.js",

    // This is just the popup script, it shouldn't trigger the plugin reload when is changed
    popup: "./sample/plugin-src/popup.js"
  },
  output: {
    publicPath: ".",
    path: resolve(__dirname, "dist/"),
    filename: "[name].js",
    libraryTarget: "umd"
  },
  plugins: [
    /***********************************************************************/
    /* By default the plugin will work only when NODE_ENV is "development" */
    /***********************************************************************/
    new WebpackReloaderPlugin(),

    new MiniCssExtractPlugin({ filename: "style.css" }),
    new CopyWebpackPlugin([
      { from: "./sample/plugin-src/popup.html" },
      { from: "./sample/manifest.json" },
      { from: "./sample/icons" }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [require("@babel/preset-env")]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader"
        ]
      },
      {
        test: /\.txt$/,
        use: "raw-loader"
      }
    ]
  }
};
