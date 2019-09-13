import HotReloaderServer from "./HotReloaderServer";
import { info } from "../utils/logger";

export default (port: number, reloadPage: boolean) => {
  const server = new HotReloaderServer(port);

  info("[ Starting the Hot Extension Reload Server... ]");
  server.listen();

  return (onlyPageChanged: boolean): Promise<any> => {
    return server.signChange(reloadPage, onlyPageChanged);
  };
};
