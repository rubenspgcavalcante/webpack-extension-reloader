import { Compiler, Plugin } from "webpack";
import CompilerEventsFacade from "./CompilerEventsFacade";

export default abstract class AbstractExtensionReloader implements Plugin {
  public context: any;
  protected _injector: InjectMiddleware;
  protected _triggerer: Triggerer;
  protected _eventAPI: CompilerEventsFacade;
  protected _chunkVersions: Record<string, any>;

  public abstract apply(compiler: Compiler);
}
