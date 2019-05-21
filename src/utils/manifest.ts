import { Entry, Output } from "webpack";
import { readFileSync } from "fs";
import { parse } from "path";
import { flatMapDeep } from "lodash";
import { bgScriptEntryRequiredMsg, bgScriptManifestRequiredMsg } from "../messages/errors";

export function extractEntries(
  webpackEntry: Entry,
  webpackOutput: Output,
  manifestPath: string
): EntriesOption {
  const manifestJson = <ExtensionManifest>JSON.parse(
    readFileSync(manifestPath).toString()
  );
  const { background, content_scripts } = manifestJson;

  if (!background) {
    throw new TypeError(bgScriptManifestRequiredMsg.get());
  }

  const finalBgNames = webpackOutput.filename
    ? background.scripts.map(bgName => webpackOutput.filename.replace('[name]', bgName))
    : background.scripts

  console.log(webpackEntry, finalBgNames);

  const bgEntry = Object.keys(webpackEntry).find(entryName =>
    background.scripts.some(bgManifest => parse(bgManifest).name === entryName)
  );

  if (!bgEntry) {
    throw new TypeError(bgScriptEntryRequiredMsg.get());
  }

  const contentEntries: unknown = content_scripts
    ? flatMapDeep(Object.keys(webpackEntry), entryName =>
        content_scripts.map(({ js }) =>
          js.filter(contentItem => parse(contentItem).name === entryName)
        )
      )
    : null;

  return { background: bgEntry, contentScript: <string[]>contentEntries };
}
