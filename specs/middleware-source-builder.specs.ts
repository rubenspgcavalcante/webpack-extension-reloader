import { assert } from "chai";
import { RawSource } from "webpack-sources";
import middlewareSourceBuilder from "../src/middleware/middleware-source-builder";

describe("middlewareSourceBuilder", () => {
  it("Build the middleware from the post-compiled source code", () => {
    assert(
      middlewareSourceBuilder({ port: 1234, reloadPage: true }) instanceof
        RawSource,
    );
  });
});
