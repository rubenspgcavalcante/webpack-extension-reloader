declare module "webpack-extension-reloader" {
  type PluginOptions = {
    port: number;
    reloadPage: boolean;
    entries: EntriesOption;
  };
  type EntriesOption = {
    background: string;
    contentScript: ContentScriptOption;
  };

  type ContentScriptOption = string | Array<string>;

  export default interface ExtensionReloader {
    new (options?: PluginOptions): ExtensionReloaderInstance;
  }

  export interface ExtensionReloaderInstance {
    apply(compiler: Object): void;
  }
}
