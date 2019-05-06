import { SourceMapSource, ConcatSource } from "webpack-sources";
import middleWareSourceBuilder from "./middleware-source-builder";
import { EntriesOption } from "webpack-extension-reloader";

import webExtensionPolyfillCode from "raw-loader!webextension-polyfill";
import webExtensionPolyfillMap from "raw-loader!webextension-polyfill/dist/browser-polyfill.js.map";

export default function middlewareInjector(
  { background, contentScript }: EntriesOption,
  { port, reloadPage }: MiddlewareTemplateParams
) {
  const source: Source = middleWareSourceBuilder({ port, reloadPage });
  const polyfillSource: Source = new SourceMapSource(
    webExtensionPolyfillCode,
    "webextension-polyfill",
    webExtensionPolyfillMap
  );
  const sourceFactory: SourceFactory = (...sources): Source =>
    new ConcatSource(...sources);

  return (assets: object, chunks: WebpackChunk[]) =>
    chunks.reduce((prev, { name, files }) => {
      if (
        name === background ||
        name === contentScript ||
        contentScript.includes(name)
      ) {
        files.forEach(entryPoint => {
          if (/\.js$/.test(entryPoint)) {
            const finalSrc = sourceFactory(
              polyfillSource,
              source,
              assets[entryPoint]
            );
            prev[entryPoint] = finalSrc;
          }
        });
      }
      return prev;
    }, {});
}
