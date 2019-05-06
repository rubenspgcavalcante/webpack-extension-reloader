import Message from "./Message";
import { ERROR } from "../constants/log.constants";

export const bgScriptRequiredMsg = new Message(
  ERROR,
  1,
  "Background script entry is required"
);
