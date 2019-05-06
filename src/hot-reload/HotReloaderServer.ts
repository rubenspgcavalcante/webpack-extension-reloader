import { Server } from "ws";
import { parse } from "useragent";
import { info } from "../utils/logger";
import SignEmitter from "./SignEmitter";

export default class HotReloaderServer {
  private _server: Server;
  private _signEmitter: SignEmitter;

  constructor(port: number) {
    this._server = new Server({ port });
  }

  listen() {
    this._server.on("connection", (ws, msg) => {
      const userAgent = parse(msg.headers["user-agent"]);
      this._signEmitter = new SignEmitter(this._server, userAgent);

      ws.on("message", (data: string) =>
        info(`Message from ${userAgent.family}: ${JSON.parse(data).payload}`)
      );
      ws.on("error", () => {
        // NOOP - swallow socket errors due to http://git.io/vbhSN
      });
    });
  }

  signChange(reloadPage: boolean): Promise<any> {
    if (this._signEmitter) {
      return this._signEmitter.safeSignChange(reloadPage);
    } else return Promise.resolve(null);
  }
}
