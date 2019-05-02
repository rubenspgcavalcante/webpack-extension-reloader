/**
 * Chrome lets only a max number of calls in a time frame
 * before block the plugin for be reloading itself to much
 * @see https://github.com/rubenspgcavalcante/webpack-chrome-extension-reloader/issues/2
 */
export const FAST_RELOAD_DEBOUNCING_FRAME = 2000;

export const FAST_RELOAD_CALLS = 6;
export const FAST_RELOAD_WAIT = 10 * 1000;

// ======================================================================================================================== //

/**
 * A new reloading rate was createad after opening a bug ticket on
 * Chromium, and the revision was merged to master
 * @see https://chromium-review.googlesource.com/c/chromium/src/+/1340272
 */

/**
 * The Chrome/Chromium version number that includes the new rates
 * @see https://storage.googleapis.com/chromium-find-releases-static/d3b.html#d3b25e1380984b2f1f23d0e8dc1a337743c6caaf
 */
export const NEW_FAST_RELOAD_CHROME_VERSION = "73.0.3637.0";

export const NEW_FAST_RELOAD_DEBOUNCING_FRAME = 1000;
export const NEW_FAST_RELOAD_CALLS = 30;
