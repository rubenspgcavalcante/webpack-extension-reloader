import { Compiler, Compilation } from "webpack";

export default class CompilerEventsFacade {
  public static extensionName = "webpack-extension-reloader";
  private _compiler: Compiler;
  private _legacyTapable: boolean;

  constructor(compiler: Compiler) {
    this._compiler = compiler;
    this._legacyTapable = !compiler.hooks;
  }

  public afterOptimizeChunkAssets(
    call: (compilation: Compilation, chunks: Compilation["chunks"]) => void,
  ) {
    return this._legacyTapable
      ? (this._compiler as any).plugin("compilation", comp =>
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

  public afterEmit(call: (compilation: Compilation) => void) {
    return this._legacyTapable
      ? (this._compiler as any).plugin("after-emit", call)
      : this._compiler.hooks.afterEmit.tap(
          CompilerEventsFacade.extensionName,
          call,
        );
  }
}
