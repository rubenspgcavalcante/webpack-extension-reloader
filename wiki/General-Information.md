## Warnings:
### WCER-W1
**Warning, Extension Reloader Plugin was not enabled! It runs only on webpack --mode=development (v4 or more) or with NODE_ENV=development (lower versions)**.  

This means that the webpack **[option.mode](https://webpack.js.org/concepts/mode/)** isn't "_development_", and the plugin will not be included on the building process. On older versions than v4, use this value on the environment variable **NODE_ENV**.
To not see this warning, make sure to not add this plugin on a non development build, on your Webpack configuration.

## Errors:
### WCER-E1
~~**Background script entry is required**~~  
**Background script webpack entry not found/match the provided on 'manifest.json' or 'entry.background' option of the plugin**.

The error is raised whenever a _background script_ is provided through the plugin options or inside `manifest.json` but it simply doesn't match (or don't exist) within the webpack entries:
```js
entry: {
    //...
    background: './my-awesome-background.js' // entry => background
},
//...
plugins: [
    new ExtensionReloader({
      //...
      entries: { 
        // ...
        background: 'background-script' // background-script != background (causes this error)
      }
    })
]
```

Without the background script, Webpack Extension reloader is unable to access the extension lifecycle through the [browser.runtime](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime) to execute the proper hot reload.  
If your **extension doesn't have background script**, at least provide an empty `background.js` on both manifest.json and Webpack plugin config, on **development mode**.

### WCER-E2
**Background script on manifest is required**  
If you're using the manifest on the plugin option, but inside of it there's no `background.scripts` entry,
will cause this error to be thrown.
Please make sure to provide at least one background:

```json
{
  "manifest_version": 2,
  "name": "Webpack Chrome Extension Reloader Sample",
  "version": "0.1",
  "background": {
    "scripts": [
      "background.bundle.js"
    ]
  },
}
```
