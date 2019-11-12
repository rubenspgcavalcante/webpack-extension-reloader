import { merge } from "lodash";
import { Compiler, Entry, Output, version } from "webpack";
import { changesTriggerer } from "./hot-reload";
import { onlyOnDevelopmentMsg } from "./messages/warnings";
import { middlewareInjector } from "./middleware";
import defaultOptions from "./utils/default-options";
import { warn } from "./utils/logger";
import { extractEntries } from "./utils/manifest";
import AbstractPluginReloader from "./webpack/AbstractExtensionReloader";
import CompilerEventsFacade from "./webpack/CompilerEventsFacade";

import {
  IExtensionReloaderInstance,
  IPluginOptions,
} from "../typings/webpack-extension-reloader";

export default class ExtensionReloaderImpl extends AbstractPluginReloader
  implements IExtensionReloaderInstance {
  private _opts?: IPluginOptions;

  constructor(options?: IPluginOptions) {
    super();
    this._opts = options;
    this._chunkVersions = {};
  }

  public _isWebpackGToEV4() {
    if (version) {
      const [major] = version.split(".");
      if (parseInt(major, 10) >= 4) {
        return true;
      }
    }
    return false;
  }

  public _whatChanged(
    chunks: IWebpackChunk[],
    { background, contentScript, extensionPage }: IEntriesOption,
  ) {
    const changedChunks = chunks.filter(({ name, hash }) => {
      const oldVersion = this._chunkVersions[name];
      this._chunkVersions[name] = hash;
      return hash !== oldVersion;
    });

    const contentOrBgChanged = changedChunks.some(({ name }) => {
      let contentChanged = false;
      const bgChanged = name === background;

      if (Array.isArray(contentScript)) {
        contentChanged = contentScript.some(script => script === name);
      } else {
        contentChanged = name === contentScript;
      }

      return contentChanged || bgChanged;
    });

    const onlyPageChanged =
      !contentOrBgChanged &&
      changedChunks.some(({ name }) => {
        let pageChanged = false;

        if (Array.isArray(extensionPage)) {
          pageChanged = extensionPage.some(script => script === name);
        } else {
          pageChanged = name === extensionPage;
        }

        return pageChanged;
      });

    return { contentOrBgChanged, onlyPageChanged };
  }

  public _registerPlugin(compiler: Compiler) {
    const { reloadPage, port, entries, manifest } = merge(
      defaultOptions,
      this._opts,
    );

    const parsedEntries: IEntriesOption = manifest
      ? extractEntries(
          compiler.options.entry as Entry,
          compiler.options.output as Output,
          manifest,
        )
      : entries;

    this._eventAPI = new CompilerEventsFacade(compiler);
    this._injector = middlewareInjector(parsedEntries, { port, reloadPage });
    this._triggerer = changesTriggerer(port, reloadPage);
    this._eventAPI.afterOptimizeChunkAssets((comp, chunks) => {
      comp.assets = {
        ...comp.assets,
        ...this._injector(comp.assets, chunks),
      };
    });

    this._eventAPI.afterEmit((comp, done) => {
      const { contentOrBgChanged, onlyPageChanged } = this._whatChanged(
        comp.chunks,
        parsedEntries,
      );

      if (contentOrBgChanged || onlyPageChanged) {
        this._triggerer(onlyPageChanged)
          .then(done)
          .catch(done);
      }
    });
  }

  public apply(compiler: Compiler) {
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
