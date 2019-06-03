declare module "webpack-extension-reloader" {
  type PluginOptions = {
    port: number;
    reloadPage: boolean;
    manifest?: string;
    entries?: EntriesOption;
  };

  export default interface ExtensionReloader {
    new (options?: PluginOptions): ExtensionReloaderInstance;
  }

  export interface ExtensionReloaderInstance {
    apply(compiler: Object): void;
  }
}
