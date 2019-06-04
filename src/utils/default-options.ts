import {
  DEFAULT_PORT,
  DEFAULT_RELOAD_PAGE,
  DEFAULT_CONTENT_SCRIPT_ENTRY,
  DEFAULT_BACKGROUND_ENTRY
} from "../constants/options.constants";

export default {
  reloadPage: DEFAULT_RELOAD_PAGE,
  port: DEFAULT_PORT,
  entries: {
    contentScript: DEFAULT_CONTENT_SCRIPT_ENTRY,
    background: DEFAULT_BACKGROUND_ENTRY
  }
};
