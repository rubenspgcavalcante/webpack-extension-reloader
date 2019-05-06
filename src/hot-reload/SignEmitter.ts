import { Server, OPEN } from "ws";
import { Agent } from "useragent";
import { zip } from "lodash";

import {
  FAST_RELOAD_DEBOUNCING_FRAME,
  FAST_RELOAD_CALLS,
  FAST_RELOAD_WAIT,
  NEW_FAST_RELOAD_CHROME_VERSION,
  NEW_FAST_RELOAD_DEBOUNCING_FRAME,
  NEW_FAST_RELOAD_CALLS
} from "../constants/fast-reloading.constants";
import { signChange } from "../utils/signals";
import { debounceSignal, fastReloadBlocker } from "../utils/block-protection";

export default class SignEmitter {
  private _safeSignChange: Function;
  private _server: Server;

  constructor(server: Server, { family, major, minor, patch }: Agent) {
    this._server = server;
    if (family === "Chrome") {
      const [reloadCalls, reloadDeboucingFrame] = this._satisfies(
        [parseInt(major), parseInt(minor), parseInt(patch)],
        NEW_FAST_RELOAD_CHROME_VERSION
      )
        ? [NEW_FAST_RELOAD_CALLS, NEW_FAST_RELOAD_DEBOUNCING_FRAME]
        : [FAST_RELOAD_CALLS, FAST_RELOAD_DEBOUNCING_FRAME];

      const debouncer = debounceSignal(reloadDeboucingFrame, this);
      const blocker = fastReloadBlocker(reloadCalls, FAST_RELOAD_WAIT, this);
      this._safeSignChange = debouncer(blocker(this._setupSafeSignChange()));
    } else {
      this._safeSignChange = this._setupSafeSignChange();
    }
  }

  safeSignChange(reloadPage: boolean): Promise<any> {
    return new Promise((res, rej) => {
      this._safeSignChange(reloadPage, res, rej);
    });
  }

  private _setupSafeSignChange() {
    return (reloadPage: boolean, onSuccess: Function, onError: Function) => {
      try {
        this._sendMsg(signChange({ reloadPage }));
        onSuccess();
      } catch (err) {
        onError(err);
      }
    };
  }

  private _sendMsg(msg: any) {
    this._server.clients.forEach(client => {
      if (client.readyState === OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  }

  private _satisfies(
    browserVersion: BrowserVersion,
    targetVersion: BrowserVersion
  ) {
    const versionPairs: Array<VersionPair> = zip(browserVersion, targetVersion);

    for (let [version = 0, target = 0] of versionPairs) {
      if (version !== target) return version > target;
    }
    return true;
  }
}
