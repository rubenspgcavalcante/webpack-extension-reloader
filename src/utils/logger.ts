import { DEBUG, ERROR, INFO, LOG, WARN } from "../constants/log.constants";
import { green, red, white, yellow } from "colors/safe";

let logLevel;
export const setLogLevel = (level: LOG_LEVEL) => (logLevel = level);

export const log = (message: string) => logLevel >= LOG && console.log(message);
export const info = (message: string) =>
  logLevel >= INFO && console.info(green(message));
export const warn = (message: string) =>
  logLevel >= WARN && console.warn(yellow(message));
export const error = (message: string) =>
  logLevel >= ERROR && console.error(red(message));
export const debug = (message: string) =>
  logLevel >= DEBUG && console.debug(white(debug(message)));
