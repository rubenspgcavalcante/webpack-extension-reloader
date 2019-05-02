import {
  DEFAULT_BACKGROUND_ENTRY,
  DEFAULT_CONTENT_SCRIPT_ENTRY,
  DEFAULT_PORT,
  DEFAULT_RELOAD_PAGE
} from "../constants/options.constants";

export default {
  reloadPage: DEFAULT_RELOAD_PAGE,
  port: DEFAULT_PORT,
  entries: {
    contentScript: DEFAULT_CONTENT_SCRIPT_ENTRY,
    background: DEFAULT_BACKGROUND_ENTRY
  }
};
