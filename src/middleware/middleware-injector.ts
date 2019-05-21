import { ConcatSource } from "webpack-sources";
import middleWareSourceBuilder from "./middleware-source-builder";

export default function middlewareInjector(
  { background, contentScript }: EntriesOption,
  { port, reloadPage }: MiddlewareTemplateParams
) {
  const source: Source = middleWareSourceBuilder({ port, reloadPage });
  const sourceFactory: SourceFactory = (...sources): Source =>
    new ConcatSource(...sources);

  const matchBgOrContent = name =>
    name === background ||
    name === contentScript ||
    (contentScript && contentScript.includes(name));

  return (assets: object, chunks: WebpackChunk[]) =>
    chunks.reduce((prev, { name, files }) => {
      if (matchBgOrContent(name)) {
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
