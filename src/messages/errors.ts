import { ERROR } from "../constants/log.constants";
import Message from "./Message";

export const bgScriptEntryErrorMsg = new Message(
  ERROR,
  1,
  "Background script webpack entry not found/match \
the provided on 'manifest.json' or 'entry.background' \
option of the plugin",
);

export const bgScriptManifestRequiredMsg = new Message(
  ERROR,
  2,
  "Background script on manifest is required",
);
