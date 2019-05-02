export default class CompilerEventsFacade {
  static extensionName = "webpack-extension-reloader";
  private _compiler: any;
  private _legacyTapable: boolean;

  constructor(compiler) {
    this._compiler = compiler;
    this._legacyTapable = !compiler.hooks;
  }

  afterOptimizeChunkAssets(call: Function) {
    return this._legacyTapable
      ? this._compiler.plugin("compilation", comp =>
          comp.plugin("after-optimize-chunk-assets", chunks =>
            call(comp, chunks)
          )
        )
      : this._compiler.hooks.compilation.tap(
          CompilerEventsFacade.extensionName,
          comp =>
            comp.hooks.afterOptimizeChunkAssets.tap(
              CompilerEventsFacade.extensionName,
              chunks => call(comp, chunks)
            )
        );
  }

  afterEmit(call: Function) {
    return this._legacyTapable
      ? this._compiler.plugin("after-emit", call)
      : this._compiler.hooks.afterEmit.tap(
          CompilerEventsFacade.extensionName,
          call
        );
  }
}
