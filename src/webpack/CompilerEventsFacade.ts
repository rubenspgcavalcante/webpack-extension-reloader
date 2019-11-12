import { Compiler } from "webpack";

export default class CompilerEventsFacade {
  public static extensionName = "webpack-extension-reloader";
  private _compiler: Compiler;
  private _legacyTapable: boolean;

  constructor(compiler) {
    this._compiler = compiler;
    this._legacyTapable = !compiler.hooks;
  }

  public afterOptimizeChunkAssets(call) {
    return this._legacyTapable
      ? this._compiler.plugin("compilation", comp =>
          comp.plugin("after-optimize-chunk-assets", chunks =>
            call(comp, chunks),
          ),
        )
      : this._compiler.hooks.compilation.tap(
          CompilerEventsFacade.extensionName,
          comp =>
            comp.hooks.afterOptimizeChunkAssets.tap(
              CompilerEventsFacade.extensionName,
              chunks => call(comp, chunks),
            ),
        );
  }

  public afterEmit(call) {
    return this._legacyTapable
      ? this._compiler.plugin("after-emit", call)
      : this._compiler.hooks.afterEmit.tap(
          CompilerEventsFacade.extensionName,
          call,
        );
  }
}
