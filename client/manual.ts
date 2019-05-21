import {
  DEFAULT_CONFIG,
  DEFAULT_PORT,
  DEFAULT_MANIFEST
} from "../src/constants/options.constants";

export default () => `
Usage:
    wer [--config <config_path>] [--port <port_number>] [--no-page-reload] [--content-script <content_script_paths>] [--background <bg_script_path>] 

Complete API:
+------------------------------------------------------------------------------------------------------------+
|        name        |    default        |                               description                         |
|--------------------|-------------------|-------------------------------------------------------------------|
| --help             |                   | Show this help
| --config           | ${
  DEFAULT_CONFIG
} | The webpack configuration file path                               |
| --port             | ${
  DEFAULT_PORT
}              | The port to run the server                                        |
| --content-script   | ${
  DEFAULT_MANIFEST
}    | The **manifest.json** path           |
| --no-page-reload   |                   | Disable the auto reloading of all **pages** which runs the plugin |
+------------------------------------------------------------------------------------------------------------+
`;
