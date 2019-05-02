declare type ActionType = string;
declare type Action = { type: ActionType; payload?: any };
declare type ActionFactory = (payload?: any) => Action;

declare type MiddlewareTemplateParams = { port: number; reloadPage: boolean };

declare type VersionPair = [number | undefined, number | undefined];

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

declare interface Source {
  source();

  size(): number;

  map(options: object): void;

  sourceAndMap(options: object): object;

  node();

  listNode();

  updateHash(hash: string): void;
}

declare type SourceFactory = (
  concatSource: string,
  rootSource: string
) => Source;

declare type WebpackChunk = { files: Array<string>; name: string, hash: string };

declare type ClientEvent = { type: string; payload: any };

declare module "*.json" {
  const json: any;
  export = json;
}

declare module "*.txt" {
  const text: string;
  export = text;
}

declare module "*.source.ts" {
  const sourceCode: string;
  export = sourceCode;
}

declare module "raw-loader*" {
  const rawText: string;
  export default rawText;
}
