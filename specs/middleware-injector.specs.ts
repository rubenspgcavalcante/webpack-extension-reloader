import { assert } from "chai";
import { stub } from "sinon";

import middlewareInjector from "../src/middleware/middleware-injector";
import * as middlewareSourceBuilder from "../src/middleware/middleware-source-builder";
import { EntriesOption } from "webpack-extension-reloader";

describe("middleware-injector", () => {
  let assetsBuilder, singleContentChunks, multipleContentsChunks;
  const sourceCode = "console.log('I am a middleware!!!');";

  stub(middlewareSourceBuilder, "default").callsFake(
    opts => sourceCode
  );

  const sourceFactory = stub().callsFake((toConcat: string, file) => ({
    source: () => toConcat + file.source()
  }));

  const entriesInfo = {
    background: { name: "bgChunkName", path: "./path/to/bg-script.js" },
    contentScript: {
      name: "contentChunkName",
      path: "./path/to/content-script.js"
    },
    extraContentScript: {
      name: "extraContentChunkName",
      path: "./path/to/extra-content-script.js"
    }
  };

  const templateOpts = { port: 1234, reloadPage: true };

  const options: EntriesOption = {
    background: entriesInfo.background.name,
    contentScript: entriesInfo.contentScript.name
  };

  const options2: EntriesOption = {
    background: entriesInfo.background.name,
    contentScript: [
      entriesInfo.contentScript.name,
      entriesInfo.extraContentScript.name
    ]
  };

  const fakeCssPath = "./path/to/some.css";
  const fakeImgPath = "./path/to/a/random-image.png";

  const assets = {
    [entriesInfo.background.path]: { source: () => "const bg = true;" },
    [entriesInfo.contentScript.path]: { source: () => "const cs = true;" },
    [entriesInfo.extraContentScript.path]: {
      source: () => "const extraCs = true;"
    },
    [fakeCssPath]: { source: () => "some-css-source" },
    [fakeImgPath]: { source: () => "some-base64-source" }
  };

  beforeEach(() => {
    singleContentChunks = [
      { name: options.background, files: [entriesInfo.background.path] },
      {
        name: options.contentScript,
        files: [entriesInfo.contentScript.path, fakeCssPath]
      },
      { name: "someOtherAsset", files: [fakeImgPath] }
    ];

    multipleContentsChunks = [
      { name: options2.background, files: [entriesInfo.background.path] },
      {
        name: options2.contentScript,
        files: [entriesInfo.contentScript.path, fakeCssPath]
      },
      {
        name: options2.contentScript[0],
        files: [entriesInfo.contentScript.path, fakeCssPath]
      },
      {
        name: options2.contentScript[1],
        files: [entriesInfo.extraContentScript.path]
      },
      { name: "someOtherAsset", files: [fakeImgPath] }
    ];
  });

  describe("Injecting middleware into background and content script entries", () => {
    let assetsSingleContent, assetsMultiContent;
    beforeEach(() => {
      assetsBuilder = middlewareInjector(options, templateOpts);
      assetsSingleContent = assetsBuilder(assets, singleContentChunks);

      assetsBuilder = middlewareInjector(options2, templateOpts);
      assetsMultiContent = assetsBuilder(assets, multipleContentsChunks);
    });

    it("Should inject into the background script", () => {
      const newBgSource = assetsSingleContent[
        entriesInfo.background.path
      ].source();
      const oldBgSource = assets[entriesInfo.background.path].source();
      assert.equal(newBgSource, sourceCode + oldBgSource);
    });

    it("Should inject into the a single contentScript", () => {
      const newContentSource = assetsSingleContent[
        entriesInfo.contentScript.path
      ].source();
      const oldContentSource = assets[entriesInfo.contentScript.path].source();
      assert.equal(newContentSource, sourceCode + oldContentSource);
    });

    it("Should inject into the multiple contentScripts", () => {
      const newFirstContentSource = assetsMultiContent[
        entriesInfo.contentScript.path
      ].source();
      const oldFirstContentSource = assets[
        entriesInfo.contentScript.path
      ].source();
      assert.equal(newFirstContentSource, sourceCode + oldFirstContentSource);

      const newSecondContentSource = assetsMultiContent[
        entriesInfo.extraContentScript.path
      ].source();
      const oldSecondContentSource = assets[
        entriesInfo.extraContentScript.path
      ].source();
      assert.equal(newSecondContentSource, sourceCode + oldSecondContentSource);
    });
  });

  it("Should return only changed assets", () => {
    assetsBuilder = middlewareInjector(options, templateOpts);
    const newAssets = assetsBuilder(assets, singleContentChunks, sourceFactory);

    assert.notOk(newAssets.hasOwnProperty(fakeCssPath));
    assert.notOk(newAssets.hasOwnProperty(fakeImgPath));
  });
});
