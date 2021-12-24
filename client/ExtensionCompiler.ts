import { log } from "util";
import * as webpack from "webpack";
import ExtensionReloaderImpl from "../src/ExtensionReloader";
import { info } from "../src/utils/logger";
import { IPluginOptions } from "../typings/webpack-extension-reloader";

export default class ExtensionCompiler {
  private static treatErrors(err) {
    log(err.stack || err);
    if (err.details) {
      log(err.details);
    }
  }
  private compiler;

  constructor(config: webpack.Configuration, pluginOptions: IPluginOptions) {
    this.compiler = webpack(config);
    new ExtensionReloaderImpl(pluginOptions).apply(this.compiler);
  }

  public watch() {
    this.compiler.watch({}, (err, stats) => {
      if (err) {
        return ExtensionCompiler.treatErrors(err);
      }
      info(stats.toString({ colors: true }));
    });
  }
}
