import Message from "./Message";
import { ERROR } from "../constants/log.constants";

export const bgScriptEntryRequiredMsg = new Message(
  ERROR,
  1,
  "Background script entry is required on webpack"
);

export const bgScriptManifestRequiredMsg = new Message(
  ERROR,
  2,
  "Background script on manifest is required"
);
