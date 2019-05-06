import { ConcatSource } from "webpack-sources";
import middleWareSourceBuilder from "./middleware-source-builder";
import { EntriesOption } from "webpack-extension-reloader";

export default function middlewareInjector(
  { background, contentScript }: EntriesOption,
  { port, reloadPage }: MiddlewareTemplateParams
) {
  const source: Source = middleWareSourceBuilder({ port, reloadPage });
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
            const finalSrc = sourceFactory(source, assets[entryPoint]);
            prev[entryPoint] = finalSrc;
          }
        });
      }
      return prev;
    }, {});
}
