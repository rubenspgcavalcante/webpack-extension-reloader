import { RawSource } from "webpack-sources";
import { assert } from "chai";
import { stub } from "sinon";

import middlewareInjector from "../src/middleware/middleware-injector";
import * as middlewareSourceBuilder from "../src/middleware/middleware-source-builder";

describe("middleware-injector", () => {
  let assetsBuilder, singleContentChunks, multipleContentsChunks;
  const sourceCode = "console.log('I am a middleware!!!');";

  stub(middlewareSourceBuilder, "default").callsFake(
    opts => new RawSource(sourceCode)
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
    },
    extensionPage: {
      name: "pageChunkName",
      path: "./path/to/popup.js"
    },
    extraExtensionPage: {
      name: "extraPageChunkName",
      path: "./path/to/options.js"
    }
  };

  const templateOpts = { port: 1234, reloadPage: true };

  const options: EntriesOption = {
    background: entriesInfo.background.name,
    contentScript: entriesInfo.contentScript.name,
    extensionPage: entriesInfo.extensionPage.name
  };

  const options2: EntriesOption = {
    background: entriesInfo.background.name,
    contentScript: [
      entriesInfo.contentScript.name,
      entriesInfo.extraContentScript.name
    ],
    extensionPage: [
      entriesInfo.extensionPage.name,
      entriesInfo.extraExtensionPage.name
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
    [entriesInfo.extensionPage.path]: { source: () => "const ep = true;" },
    [entriesInfo.extraExtensionPage.path]: {
      source: () => "const extraEp = true;"
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
      {
        name: options.extensionPage,
        files: [entriesInfo.extensionPage.path, fakeCssPath]
      },
      { name: "someOtherAsset", files: [fakeImgPath] }
    ];

    const [firstContent, secondContent] = <string[]>options2.contentScript;
    const [firstPage, secondPage] = <string[]>options2.extensionPage;

    multipleContentsChunks = [
      { name: options2.background, files: [entriesInfo.background.path] },
      {
        name: options2.contentScript,
        files: [entriesInfo.contentScript.path, fakeCssPath]
      },
      {
        name: firstContent,
        files: [entriesInfo.contentScript.path, fakeCssPath]
      },
      {
        name: secondContent,
        files: [entriesInfo.extraContentScript.path]
      },
      {
        name: options2.extensionPage,
        files: [entriesInfo.extensionPage.path, fakeCssPath]
      },
      {
        name: firstPage,
        files: [entriesInfo.extensionPage.path, fakeCssPath]
      },
      {
        name: secondPage,
        files: [entriesInfo.extraExtensionPage.path]
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

      assert.include(newBgSource, oldBgSource);
      assert.include(newBgSource, sourceCode);
    });

    it("Should inject into a single contentScript", () => {
      const newContentSource = assetsSingleContent[
        entriesInfo.contentScript.path
      ].source();
      const oldContentSource = assets[entriesInfo.contentScript.path].source();
      assert.include(newContentSource, oldContentSource);
      assert.include(newContentSource, sourceCode);
    });

    it("Should inject into the multiple contentScripts", () => {
      const newFirstContentSource = assetsMultiContent[
        entriesInfo.contentScript.path
      ].source();
      const oldFirstContentSource = assets[
        entriesInfo.contentScript.path
      ].source();

      assert.include(newFirstContentSource, oldFirstContentSource);
      assert.include(newFirstContentSource, sourceCode);

      const newSecondContentSource = assetsMultiContent[
        entriesInfo.extraContentScript.path
      ].source();

      const oldSecondContentSource = assets[
        entriesInfo.extraContentScript.path
      ].source();

      assert.include(newSecondContentSource, oldSecondContentSource);
      assert.include(newSecondContentSource, sourceCode);
    });

    it("Should inject into a single extensionPage", () => {
      const newContentSource = assetsSingleContent[
        entriesInfo.extensionPage.path
      ].source();
      const oldContentSource = assets[entriesInfo.extensionPage.path].source();
      assert.include(newContentSource, oldContentSource);
      assert.include(newContentSource, sourceCode);
    });

    it("Should inject into the multiple extensionPages", () => {
      const newFirstContentSource = assetsMultiContent[
        entriesInfo.extensionPage.path
      ].source();
      const oldFirstContentSource = assets[
        entriesInfo.extensionPage.path
      ].source();

      assert.include(newFirstContentSource, oldFirstContentSource);
      assert.include(newFirstContentSource, sourceCode);

      const newSecondContentSource = assetsMultiContent[
        entriesInfo.extraExtensionPage.path
      ].source();

      const oldSecondContentSource = assets[
        entriesInfo.extraExtensionPage.path
      ].source();

      assert.include(newSecondContentSource, oldSecondContentSource);
      assert.include(newSecondContentSource, sourceCode);
    });
  });

  it("Should return only changed assets", () => {
    assetsBuilder = middlewareInjector(options, templateOpts);
    const newAssets = assetsBuilder(assets, singleContentChunks, sourceFactory);

    assert.notOk(newAssets.hasOwnProperty(fakeCssPath));
    assert.notOk(newAssets.hasOwnProperty(fakeImgPath));
  });
});
