# Example of Plugin using WER

I this directory you can see a example of plugin project using Webpack and the webpack-extension-reloader.

# How it works

## Build the WER plugin files

```sh
$ yarn build
```

This will create the `/dist` folder containing the plugin files built into a bundle.

## Run the WER server

```sh
$ yarn start:sample
```

This will create the `sample/dist` folder with the initial files. Since the `start:sample` command starts Webpack with `--watch` option, any further change will be detected automatically and emitted to the `sample/dist` folder. Also, it loads the `webpack.plugin.js` config.

## Load the extension for the first time in your browser

### Google Chrome

1. Access `chrome://extensions`
2. Enable `Developer mode` at the top-right corner
3. Click on `Load unpacked` at the top-left corner
4. Select the `sample/dist` folder

> Make sure you load the `sample/dist` folder and **not** the `sample/plugin-src` one, as your extension must load the transpiled files.

Open your preferred webpage (can't be the Homepage), then open your DevTools Console, and you should be able to see some logs being printed there (from both `my-content-script` and `my-background` files) plus a message from the Hot Reload Server:

```
[ WER: Connected to Extension Hot Reloader ]
```

## Make any change and see it being applied automatically

Change anything inside `sample/plugin-src` and see the page reload your extension automatically.

> Tip: try to change the content of the console log within the `my-content-script`, and see the page reload and show the new result.

> Tip: try to change the content of the console log within the `popup`, and see the popup reload and show the new result without reloading the entire extension.

## Why can't I load plugin-src/ dir?
The source needs to be parsed and bundled by Webpack, then is outputted on the `dist` directory. This means
you can't directly load this directory as a extension.
The source in dist will contain the necessary data to make the Hot Reloading work properly.

## Running Webpack in watch mode
As the browser is the "server" of our files, we don't need to run any server other than the one created by
the WER itself. Don't worry, it creates with no, just by using the plugin it will take care for you.
All you need to do is run your webpack with the `--watch` option enabled, and every time any change happens
Webpack will rebuild all for you, triggering the WER plugin, signing the extension to be reloaded.

## Manifest and Icons
As both manifest.json and icons aren't directly processed on the extension source, it needs to be
copied to the final output directory `dist/`. So, if you check the `webpack.plugin.js` configuration you can
see the [CopyWebpackPlugin](https://github.com/webpack-contrib/copy-webpack-plugin) being used to move both
manifest and icons to the output directory.
