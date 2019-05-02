import { Plugin } from "webpack";
import CompilerEventsFacade from "./CompilerEventsFacade";

export default abstract class AbstractExtensionReloader
  implements Plugin {
  protected _injector: Function;
  protected _triggerer: Function;
  protected _eventAPI: CompilerEventsFacade;
  protected _chunkVersions: Object;

  context: any;

  abstract apply(options?: any);
}
