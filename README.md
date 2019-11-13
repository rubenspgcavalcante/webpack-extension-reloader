# Webpack Extension Reloader
A Webpack plugin to automatically reload browser extensions during development.

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <br>
  <br>
</div>
  
[![npm version](https://badge.fury.io/js/webpack-extension-reloader.svg)](https://badge.fury.io/js/webpack-extension-reloader)
[![Test Status](https://github.com/rubenspgcavalcante/webpack-extension-reloader/workflows/tests/badge.svg)](https://github.com/rubenspgcavalcante/webpack-extension-reloader/actions?query=branch%3Amaster)
[![NPM Downloads](https://img.shields.io/npm/dt/webpack-extension-reloader.svg)](https://www.npmjs.com/package/webpack-extension-reloader)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b93aa8303bfb44a2a621cac57639ca26)](https://www.codacy.com/app/rubenspgcavalcante/webpack-extension-reloader?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=rubenspgcavalcante/webpack-extension-reloader&amp;utm_campaign=Badge_Grade) [![Greenkeeper badge](https://badges.greenkeeper.io/rubenspgcavalcante/webpack-extension-reloader.svg)](https://greenkeeper.io/)

## Installing

npm
```bash
npm install webpack-extension-reloader --save-dev
```

yarn 
```bash
yarn add webpack-extension-reloader --dev
```

## Solution for ...
Have your ever being annoyed while developing a browser extension, and being unable to use
webpack-hot-server because it's not a web app but a browser extension?

Well, now you can have automatic reloading!

![](.github/sample-gif.gif)

**Note**: This plugin doesn't allow [**Hot Module Replacement (HMR)**](https://webpack.js.org/concepts/hot-module-replacement/) yet.

## What it does?
Basically something similar to what the webpack hot reload middleware does. When you change the code and the webpack
trigger and finish the compilation, your extension is notified and then reloaded using the [standard browser runtime API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions).  
Check out [Hot reloading extensions using Webpack](https://medium.com/front-end-hacking/hot-reloading-extensions-using-webpack-cdfa0e4d5a08) for more background.

## How to use
### Using as a plugin
Add `webpack-extension-reloader` to the plugins section of your webpack configuration file. Note that this plugin don't outputs the manifest (at most read it to gather information).
For outputing not only the `manifest.json` but other static files too, use `CopyWebpackPlugin`.
```js
const ExtensionReloader  = require('webpack-extension-reloader');

plugins: [
  new ExtensionReloader(),
  new CopyWebpackPlugin([
      { from: "./src/manifest.json" },
      { from: "./src/popup.html" },
    ]),
]
```

You can point to your `manifest.json file`...
```js
plugins: [
  new ExtensionReloader({
    manifest: path.resolve(__dirname, "manifest.json")
  }),
  // ...
]
```

... or you can also use some extra options (the following are the default ones):
```js
// webpack.dev.js
module.exports = {
  mode: "development", // The plugin is activated only if mode is set to development
  watch: true,
  entry: {
    'content-script': './my-content-script.js',
    background: './my-background-script.js',
    popup: 'popup',
  },
  //...
  plugins: [
    new ExtensionReloader({
      port: 9090, // Which port use to create the server
      reloadPage: true, // Force the reload of the page also
      entries: { // The entries used for the content/background scripts or extension pages
        contentScript: 'content-script',
        background: 'background',
        extensionPage: 'popup',
      }
    }),
    // ...
  ]
}
```
**Note I**: `entry` or `manifest` are needed. If both are given, entry will override the information comming from `manifest.json`. If none are given the default `entry` values (see above) are used.

And then just run your application with Webpack in watch mode:
```bash
NODE_ENV=development webpack --config myconfig.js --mode=development --watch 
```

**Note II**: You need to set `--mode=development` to activate the plugin (only if you didn't set on the webpack.config.js already) then you need to run with `--watch`, as the plugin will be able to sign the extension only if webpack triggers the rebuild (again, only if you didn't set on webpack.config).

### Multiple Content Script and Extension Page support
If you use more than one content script or extension page in your extension, like:
```js
entry: {
  'my-first-content-script': './my-first-content-script.js',
  'my-second-content-script': './my-second-content-script.js',
  // and so on ...
  background: './my-background-script.js',
  'popup': './popup.js',
  'options': './options.js',
  // and so on ...
}
```

You can use the `entries.contentScript` or `entries.extensionPage` options as an array:
```js
plugins: [
  new ExtensionReloader({
    entries: { 
      contentScript: ['my-first-content-script', 'my-second-content-script', /* and so on ... */],
      background: 'background',
      extensionPage: ['popup', 'options', /* and so on ... */],
    }
  }),
  // ...
]
```

### CLI
If you don't want all the plugin setup, you can just use the client that comes with the package.  
You can use by installing the package globally, or directly using `npx`:

```bash
npx webpack-extension-reloader
```
If you run directly, it will use the  default configurations, but if you want to customize
you can call it with the following options:
```bash
npx webpack-extension-reloader --config wb.config.js --port 9080 --no-page-reload --content-script my-content.js --background bg.js --extension-page popup.js
```
If you have **multiple** content scripts or extension pages, just use comma (with no spaces) while passing the option
```bash
npx webpack-extension-reloader --content-script my-first-content.js,my-second-content.js,my-third-content.js --extension-page popup.js,options.js
```

### Client options

| name             | default           | description                                                       |
| ---------------- | ----------------- | ----------------------------------------------------------------- |
| --help           |                   | Shows this help                                                   |
| --config         | webpack.config.js | The webpack configuration file path                               |
| --port           | 9090              | The port to run the server                                        |
| --manifest       |                   | The path to the extension **manifest.json** file                  |
| --content-script | content-script    | The **entry/entries** name(s) for the content script(s)           |
| --background     | background        | The **entry** name for the background script                      |
| --extension-page | popup             | The **entry/entries** name(s) for the extension pages(s)          |
| --no-page-reload |                   | Disable the auto reloading of all **pages** which runs the plugin |

Every time content or background scripts are modified, the extension is reloaded :)  
**Note:** the plugin only works on **development** mode, so don't forget to set the NODE_ENV before run the command above

### Contributing
Please before opening any **issue** or **pull request** check the [contribution guide](/.github/CONTRIBUTING.MD).

### License
This project is under the [MIT LICENSE](http://opensource.org/licenses/MIT)
