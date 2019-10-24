import * as webpack from "webpack";
import { Configuration } from "webpack";
import ExtensionReloaderImpl from "../src/ExtensionReloader";
import { log } from "util";
import { info } from "../src/utils/logger";
import { PluginOptions } from "../typings/webpack-extension-reloader";

export default class ExtensionCompiler {
  private compiler;

  constructor(
    config: (env: Object, args: Array<any>) => Configuration | Configuration,
    pluginOptions: PluginOptions
  ) {
    this.compiler = webpack(
      typeof config === "function" ? config(process.env, process.argv) : config
    );
    new ExtensionReloaderImpl(pluginOptions).apply(this.compiler);
  }

  private static treatErrors(err) {
    log(err.stack || err);
    if (err.details) {
      log(err.details);
    }
  }

  watch() {
    this.compiler.watch({}, (err, stats) => {
      if (err) {
        return ExtensionCompiler.treatErrors(err);
      }
      info(stats.toString({ colors: true }));
    });
  }
}
