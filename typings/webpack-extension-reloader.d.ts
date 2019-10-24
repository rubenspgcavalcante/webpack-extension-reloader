export type PluginOptions = {
  port: number;
  reloadPage: boolean;
  manifest?: string;
  entries?: EntriesOption;
};

export interface ExtensionReloaderInstance {
  apply(compiler: Object): void;
}

export interface ExtensionReloader {
  new (options?: PluginOptions): ExtensionReloaderInstance;
}

declare module "webpack-extension-reloader" {
  export default ExtensionReloader;
  export = ExtensionReloaderInstance;
}
