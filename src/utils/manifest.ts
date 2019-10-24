import { Entry, Output } from "webpack";
import { readFileSync } from "fs";
import { flatMapDeep } from "lodash";
import {
  bgScriptEntryErrorMsg,
  bgScriptManifestRequiredMsg
} from "../messages/errors";

export function extractEntries(
  webpackEntry: Entry,
  webpackOutput: Output = {},
  manifestPath: string
): EntriesOption {
  const manifestJson = <ExtensionManifest>(
    JSON.parse(readFileSync(manifestPath).toString())
  );
  const { background, content_scripts } = manifestJson;

  const { filename } = webpackOutput;
  if (!filename) {
    throw new Error();
  }

  if (!background) {
    throw new TypeError(bgScriptManifestRequiredMsg.get());
  }

  const bgScriptFileNames = background.scripts;
  const toRemove = (filename as string).replace("[name]", "");

  const bgWebpackEntry = Object.keys(webpackEntry).find(entryName =>
    bgScriptFileNames.some(
      bgManifest => bgManifest.replace(toRemove, "") === entryName
    )
  );

  if (!bgWebpackEntry) {
    throw new TypeError(bgScriptEntryErrorMsg.get());
  }

  const contentEntries: unknown = content_scripts
    ? flatMapDeep(Object.keys(webpackEntry), entryName =>
        content_scripts.map(({ js }) =>
          js
            .map(contentItem => contentItem.replace(toRemove, ""))
            .filter(contentItem => contentItem === entryName)
        )
      )
    : null;
  return {
    background: bgWebpackEntry,
    contentScript: <string[]>contentEntries,
    extensionPage: null
  };
}
