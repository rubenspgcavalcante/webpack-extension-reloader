const path = require("path");
const { BannerPlugin } = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const pack = require("./package.json");
const { isDevelopment, isProduction, test } = require("./src/utils/env");

const mode = isDevelopment ? "development" : "production";
const packName = "webpack-extension-reloader";

module.exports = (env = { analyze: false }) => ({
  mode,
  target: "node",
  entry: test({ tests: "./specs/index.ts" }) || {
    [packName]: "./src/index.ts",
    [`${packName}-cli`]: "./client/index.ts",
  },
  devtool: "inline-source-map",
  output: {
    publicPath: ".",
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    libraryTarget: "umd",
  },
  plugins: [
    env.analyze && isProduction(new BundleAnalyzerPlugin({ sourceMap: true })),
    new BannerPlugin({
      banner: `/// <reference path="../typings/${packName}.d.ts" />`,
      raw: true,
      entryOnly: true,
      include: "webpack-extension-reloader",
    }),
    new BannerPlugin({
      banner: "#!/usr/bin/env node",
      raw: true,
      entryOnly: true,
      include: `${packName}-cli`,
    }),
  ].filter(plugin => !!plugin),
  externals: [
    ...Object.keys(pack.dependencies),
    "webpack",
    "webpack-extension-reloader",
  ],
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    mainFiles: ["index"],
    extensions: [".ts", ".tsx", ".js"],
  },
  optimization: {
    minimize: false,
    nodeEnv: false,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: "json-loader",
      },
      {
        test: /\.txt$/,
        exclude: /node_modules/,
        loader: "raw-loader",
      },
    ],
  },
});
