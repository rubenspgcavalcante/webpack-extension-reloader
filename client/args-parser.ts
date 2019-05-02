import {
  BACKGROUND_ENTRY,
  CONFIG,
  CONTENT_SCRIPT_ENTRY,
  HELP,
  NO_PAGE_RELOAD,
  PORT
} from "./args.constant";
import { resolve } from "path";
import {
  DEFAULT_BACKGROUND_ENTRY,
  DEFAULT_CONFIG,
  DEFAULT_CONTENT_SCRIPT_ENTRY,
  DEFAULT_PORT
} from "../src/constants/options.constants";
import { cwd } from "process";
import manual from "./manual";
import { SIG_EXIT } from "./events.constants";
import { log, error } from "util";
import { PluginOptions } from "webpack-extension-reloader";

export default (args: object) => {
  if (args[HELP]) {
    log(manual());
    throw { type: SIG_EXIT, payload: 0 };
  }

  const config = args[CONFIG] || DEFAULT_CONFIG;
  const port = args[PORT] || DEFAULT_PORT;
  const contentArg = args[CONTENT_SCRIPT_ENTRY] || DEFAULT_CONTENT_SCRIPT_ENTRY;
  const contentScript = contentArg.includes(",")
    ? contentArg.split(",")
    : contentArg;

  const background = args[BACKGROUND_ENTRY] || DEFAULT_BACKGROUND_ENTRY;
  const pluginOptions: PluginOptions = {
    port,
    reloadPage: !args[NO_PAGE_RELOAD],
    entries: { contentScript, background }
  };

  const optPath = resolve(cwd(), config);

  try {
    // tslint:disable-next-line:no-eval
    const webpackConfig = eval("require")(optPath);
    return { webpackConfig, pluginOptions };
  } catch (err) {
    error(`[Error] Couldn't require the file: ${optPath}`);
    error(err);
    throw { type: SIG_EXIT, payload: 1 };
  }
};
