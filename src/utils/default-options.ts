import {
  DEFAULT_BACKGROUND_ENTRY,
  DEFAULT_CONTENT_SCRIPT_ENTRY,
  DEFAULT_EXTENSION_PAGE_ENTRY,
  DEFAULT_PORT,
  DEFAULT_RELOAD_PAGE,
} from "../constants/options.constants";

export default {
  entries: {
    background: DEFAULT_BACKGROUND_ENTRY,
    contentScript: DEFAULT_CONTENT_SCRIPT_ENTRY,
    extensionPage: DEFAULT_EXTENSION_PAGE_ENTRY,
  },
  port: DEFAULT_PORT,
  reloadPage: DEFAULT_RELOAD_PAGE,
};
