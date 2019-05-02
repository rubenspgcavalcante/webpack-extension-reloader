import { assert } from "chai";
import { useFakeTimers } from "sinon";
import { FAST_RELOAD_DEBOUNCING_FRAME } from "../src/constants/fast-reloading.constants";
import { debounceSignal } from "../src/utils/block-protection";

const _ = require("lodash");

describe("debounce signals to prevent extension block", () => {
  let calls;
  const clock = useFakeTimers();

  const test = () => {
    calls++;
  };

  beforeEach(() => {
    calls = 0;
  });

  afterEach(() => {
    clock.restore();
  });

  it(`It should debounce the method call for ${
    FAST_RELOAD_DEBOUNCING_FRAME
  } milli`, () => {
    const sample = debounceSignal(FAST_RELOAD_DEBOUNCING_FRAME)(test);

    sample();
    clock.tick(400);
    sample();
    clock.tick(FAST_RELOAD_DEBOUNCING_FRAME);
    assert.equal(calls, 1);
  });
});
