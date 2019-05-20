import { merge } from "lodash";
import AbstractPluginReloader from "./webpack/AbstractExtensionReloader";
import { middlewareInjector } from "./middleware";
import { changesTriggerer } from "./hot-reload";
import defaultOptions from "./utils/default-options";
import CompilerEventsFacade from "./webpack/CompilerEventsFacade";
import { onlyOnDevelopmentMsg } from "./messages/warnings";
import { bgScriptRequiredMsg } from "./messages/errors";
import { warn } from "./utils/logger";
import { Compiler, version } from "webpack";

import {
  ExtensionReloaderInstance,
  PluginOptions,
  EntriesOption
} from "webpack-extension-reloader";

export default class ExtensionReloaderImpl extends AbstractPluginReloader
  implements ExtensionReloaderInstance {
  private _opts?: PluginOptions;
  constructor(options?: PluginOptions) {
    super();
    this._opts = options;
    this._chunkVersions = {};
  }

  _isWebpackGToEV4() {
    if (version) {
      const [major] = version.split(".");
      if (parseInt(major) >= 4) return true;
    }
    return false;
  }

  _contentOrBgChanged(
    chunks: WebpackChunk[],
    { background, contentScript }: EntriesOption
  ) {
    return chunks
      .filter(({ name, hash }) => {
        const oldVersion = this._chunkVersions[name];
        this._chunkVersions[name] = hash;
        return hash !== oldVersion;
      })
      .some(({ name }) => name === background || name === contentScript);
  }

  _registerPlugin(compiler: Compiler) {
    const { reloadPage, port, entries } = merge(defaultOptions, this._opts);

    this._eventAPI = new CompilerEventsFacade(compiler);
    this._injector = middlewareInjector(entries, { port, reloadPage });
    this._triggerer = changesTriggerer(port, reloadPage);
    this._eventAPI.afterOptimizeChunkAssets((comp, chunks) => {
      if (!compiler.options.entry || !compiler.options.entry[entries.background]) {
        throw new TypeError(bgScriptRequiredMsg.get());
      }
      comp.assets = {
        ...comp.assets,
        ...this._injector(comp.assets, chunks)
      };
    });
    this._eventAPI.afterEmit((comp, done) => {
      if (this._contentOrBgChanged(comp.chunks, entries)) {
        this._triggerer()
          .then(done)
          .catch(done);
      }
    });
  }

  apply(compiler: Compiler) {
    if (
      (this._isWebpackGToEV4()
        ? compiler.options.mode
        : process.env.NODE_ENV) === "development"
    ) {
      this._registerPlugin(compiler);
    } else {
      warn(onlyOnDevelopmentMsg.get());
    }
  }
}
