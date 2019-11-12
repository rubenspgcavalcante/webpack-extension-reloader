import { info } from "../utils/logger";
import HotReloaderServer from "./HotReloaderServer";

const changesTriggerer: TriggererFactory = (
  port: number,
  reloadPage: boolean,
) => {
  const server = new HotReloaderServer(port);

  info("[ Starting the Hot Extension Reload Server... ]");
  server.listen();

  return (onlyPageChanged: boolean): Promise<any> => {
    return server.signChange(reloadPage, onlyPageChanged);
  };
};

export default changesTriggerer;
