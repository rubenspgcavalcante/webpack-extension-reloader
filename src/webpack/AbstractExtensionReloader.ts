import { Compiler } from "webpack";
import CompilerEventsFacade from "./CompilerEventsFacade";

export default abstract class AbstractExtensionReloader {
  public context: any;
  protected _injector: InjectMiddleware;
  protected _triggerer: Triggerer;
  protected _eventAPI: CompilerEventsFacade;
  protected _chunkVersions: Record<string, any>;

  public abstract apply(compiler: Compiler);
}
