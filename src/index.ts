import { install } from "source-map-support";
import ExtensionReloaderImpl from "./ExtensionReloader";
import { DEBUG, ERROR, NONE } from "./constants/log.constants";
import { setLogLevel } from "./utils/logger";

install();

const logLevel = process.env.NODE_ENV
  ? {
      production: ERROR,
      development: DEBUG,
      test: NONE
    }[process.env.NODE_ENV]
  : ERROR;

setLogLevel(logLevel);
export = ExtensionReloaderImpl;
