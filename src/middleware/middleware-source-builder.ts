import { template } from "lodash";
import { RawSource } from "webpack-sources";
import rawSource from "raw-loader!./wer-middleware.raw";
import polyfillSource from "raw-loader!webextension-polyfill";

import {
  RECONNECT_INTERVAL,
  SOCKET_ERR_CODE_REF
} from "../constants/middleware-config.constants";
import * as signals from "../utils/signals";

export default function middleWareSourceBuilder({
  port,
  reloadPage
}: MiddlewareTemplateParams): Source {
  const tmpl = template(rawSource);

  return new RawSource(
    tmpl({
      polyfillSource: `"||${polyfillSource}"`,
      WSHost: `ws://localhost:${port}`,
      reloadPage: `${reloadPage}`,
      signals: JSON.stringify(signals),
      config: JSON.stringify({ RECONNECT_INTERVAL, SOCKET_ERR_CODE_REF })
    })
  );
}
