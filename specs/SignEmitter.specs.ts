import SignEmitter from "../src/hot-reload/SignEmitter";
import { assert } from "chai";
import { spy, SinonSpy } from "sinon";
import * as blockProtection from "../src/utils/block-protection";
import * as logger from "../src/utils/logger";

import {
  FAST_RELOAD_DEBOUNCING_FRAME,
  FAST_RELOAD_CALLS,
  FAST_RELOAD_WAIT,
  NEW_FAST_RELOAD_CHROME_VERSION,
  NEW_FAST_RELOAD_DEBOUNCING_FRAME,
  NEW_FAST_RELOAD_CALLS
} from "../src/constants/fast-reloading.constants";
import { browserVerWrongFormatMsg } from "../src/messages/warnings";

describe("SignEmitter", () => {
  let mockedServer: any;
  let debouncerSpy: SinonSpy;
  let warnSpy: SinonSpy;
  let fastReloadBlockerSpy: SinonSpy;

  beforeEach(() => {
    mockedServer = {
      clients: []
    };
    debouncerSpy = spy(blockProtection, "debounceSignal");
    warnSpy = spy(logger, "warn");
    fastReloadBlockerSpy = spy(blockProtection, "fastReloadBlocker");
  });
  afterEach(() => {
    debouncerSpy.restore();
    fastReloadBlockerSpy.restore();
    warnSpy.restore();
  });

  it("Should setup signal debouncer as fast reload blocker to avoid extension blocking", () => {
    const emitter = new SignEmitter(mockedServer, "0.0.0.0");

    assert(debouncerSpy.calledWith(FAST_RELOAD_DEBOUNCING_FRAME));
    assert(
      fastReloadBlockerSpy.calledWith(FAST_RELOAD_CALLS, FAST_RELOAD_WAIT)
    );
  });

  it(`Should assign new rules if the Chrome/Chromium version is >= ${
    NEW_FAST_RELOAD_CHROME_VERSION
  }`, () => {
    const emitter = new SignEmitter(
      mockedServer,
      NEW_FAST_RELOAD_CHROME_VERSION
    );

    assert(debouncerSpy.calledWith(NEW_FAST_RELOAD_DEBOUNCING_FRAME));
    assert(
      fastReloadBlockerSpy.calledWith(NEW_FAST_RELOAD_CALLS, FAST_RELOAD_WAIT)
    );
  });

  it("Should fallback into debounce mode and warn user when isn't possible to identify the browser version", () => {
    const browserVer = "<wrong format>";
    const emitter = new SignEmitter(mockedServer, browserVer);

    assert(debouncerSpy.calledWith(FAST_RELOAD_DEBOUNCING_FRAME));
    assert(
      fastReloadBlockerSpy.calledWith(FAST_RELOAD_CALLS, FAST_RELOAD_WAIT)
    );

    assert(
      warnSpy.calledWith(browserVerWrongFormatMsg.get({ version: browserVer }))
    );
  });
});
