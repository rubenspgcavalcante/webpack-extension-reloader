declare type ActionType = string;
declare type Action = { type: ActionType; payload?: any };
declare type ActionFactory = (payload?: any) => Action;

declare type MiddlewareTemplateParams = { port: number; reloadPage: boolean };

declare type VersionPair = [number | undefined, number | undefined];

declare type EntriesOption = {
  background: string;
  contentScript: ContentScriptOption;
  extensionPage?: ExtensionPageOption;
};

declare type ContentScriptOption = string | string[] | null;
declare type ExtensionPageOption = string | string[] | null;

declare type LOG_NONE = 0;
declare type LOG_LOG = 1;
declare type LOG_INFO = 2;
declare type LOG_WARN = 3;
declare type LOG_ERROR = 4;
declare type LOG_DEBUG = 5;

declare type LOG_LEVEL =
  | LOG_NONE
  | LOG_LOG
  | LOG_INFO
  | LOG_WARN
  | LOG_ERROR
  | LOG_DEBUG;

declare type WebpackChunk = {
  files: string[];
  name: string;
  hash: string;
};

declare type ClientEvent = { type: string; payload: any };

declare type BrowserVersion = [number, number, number];

declare type ExtensionManifest = {
  manifest_version: string;
  name: string;
  version: string;
  background?: {
    page?: string;
    scripts?: string[];
  };
  icons?: {
    [key: string]: string;
  };
  browser_action?: {
    default_popup: string;
  };
  content_scripts?: [
    {
      matches: string[];
      js: string[];
      css: string[];
    }
  ];
};
