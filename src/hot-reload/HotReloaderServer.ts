import { parse } from "useragent";
import { Server } from "ws";
import { info } from "../utils/logger";
import SignEmitter from "./SignEmitter";

export default class HotReloaderServer {
  private _server: Server;
  private _signEmitter: SignEmitter;

  constructor(port: number) {
    this._server = new Server({ port });
  }

  public listen() {
    this._server.on("connection", (ws, msg) => {
      const userAgent = parse(msg.headers["user-agent"]);
      this._signEmitter = new SignEmitter(this._server, userAgent);

      ws.on("message", (data: string) =>
        info(`Message from ${userAgent.family}: ${JSON.parse(data).payload}`),
      );
      ws.on("error", () => {
        // NOOP - swallow socket errors due to http://git.io/vbhSN
      });
    });
  }

  public signChange(
    reloadPage: boolean,
    onlyPageChanged: boolean,
  ): Promise<any> {
    if (this._signEmitter) {
      return this._signEmitter.safeSignChange(reloadPage, onlyPageChanged);
    } else {
      return Promise.resolve(null);
    }
  }
}
