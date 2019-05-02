import ws = require("ws");
import { assert } from "chai";
import { spy, stub } from "sinon";
import HotReloaderServer from "../src/hot-reload/HotReloaderServer";
import changesTriggerer from "../src/hot-reload/changes-triggerer";

describe("changesTriggerer", () => {
  let listenSpy;
  beforeEach(() => {
    stub(ws, "Server").callsFake(function() {
        this.on = () => null;
        this.send = () => null;
    });
    listenSpy = spy(HotReloaderServer.prototype, "listen");
    stub(HotReloaderServer.prototype, "signChange").callsFake(() =>
      Promise.resolve()
    );
  });

  it("Should start the hot reloading server", () => {
    changesTriggerer(8080, true);
    assert.isOk(listenSpy.calledOnce);
  });
});
