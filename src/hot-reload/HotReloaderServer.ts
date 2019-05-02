import { Server } from "ws";
import { info } from "../utils/logger";
import SignEmitter from "./SignEmitter";

export default class HotReloaderServer {
  private _server: Server;
  private _signEmiter: SignEmitter;

  constructor(port: number) {
    this._server = new Server({ port });
  }

  listen() {
    this._server.on("connection", (ws, msg) => {
      const browserVersion = this._getBrowserVersion(msg.headers["user-agent"]);
      this._signEmiter = new SignEmitter(this._server, browserVersion);

      ws.on("message", (data: string) =>
        info(`Message from the client: ${JSON.parse(data).payload}`)
      );
      ws.on("error", () => {
        // NOOP - swallow socket errors due to http://git.io/vbhSN
      });
    });
  }

  signChange(reloadPage: boolean): Promise<any> {
    if (this._signEmiter) {
      return this._signEmiter.safeSignChange(reloadPage);
    } else return Promise.resolve(null);
  }

  private _getBrowserVersion(userAgent) {
    const ver = userAgent.match(/\ Chrom(e|ium)\/([0-9\.]*)\ /);
    if (ver && ver.length === 3) {
      return ver[2];
    }
    return false;
  }
}
