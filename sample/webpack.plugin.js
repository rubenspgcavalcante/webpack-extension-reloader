const { resolve } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtensionReloaderPlugin = require("../dist/webpack-extension-reloader");

const mode = process.env.NODE_ENV;
module.exports = {
  mode,
  devtool: "inline-source-map",
  entry: {
    "content-script": "./sample/plugin-src/my-content-script.js",
    background: "./sample/plugin-src/my-background.js",
    popup: "./sample/plugin-src/popup.js"
  },
  output: {
    publicPath: ".",
    path: resolve(__dirname, "dist/"),
    filename: "[name].bundle.js",
    libraryTarget: "umd"
  },
  plugins: [
    /***********************************************************************/
    /* By default the plugin will work only when NODE_ENV is "development" */
    /***********************************************************************/
    new ExtensionReloaderPlugin({
      entries: {
        contentScript: "content-script",
        background: "background",
        extensionPage: "popup"
      }
      // Also possible to use
      // manifest: resolve(__dirname, "manifest.json")
    }),

    new MiniCssExtractPlugin({ filename: "style.css" }),
    new CopyWebpackPlugin([
      {
        /***********************************************************************/
        /* If you have different configurations for development and production,*/
        /* you can have two manifests (one for each environment)               */
        /***********************************************************************/
        from:
          process.env.NODE_ENV === "development"
            ? "./sample/manifest.dev.json"
            : "./sample/manifest.prod.json",
        to: "manifest.json"
      },
      { from: "./sample/plugin-src/popup.html" },
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
