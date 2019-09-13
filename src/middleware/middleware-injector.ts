import { ConcatSource } from "webpack-sources";
import middleWareSourceBuilder from "./middleware-source-builder";

export default function middlewareInjector(
  { background, contentScript, extensionPage }: EntriesOption,
  { port, reloadPage }: MiddlewareTemplateParams
) {
  const source: Source = middleWareSourceBuilder({ port, reloadPage });
  const sourceFactory: SourceFactory = (...sources): Source =>
    new ConcatSource(...sources);

  const matchBgOrContentOrPage = name =>
    name === background ||
    name === contentScript ||
    (contentScript && contentScript.includes(name)) ||
    name === extensionPage ||
    (extensionPage && extensionPage.includes(name));

  return (assets: object, chunks: WebpackChunk[]) =>
    chunks.reduce((prev, { name, files }) => {
      if (matchBgOrContentOrPage(name)) {
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
