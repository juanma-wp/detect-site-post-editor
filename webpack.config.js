const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
  ...defaultConfig,
  entry: {
    index: path.resolve(__dirname, "plugin/resources/js", "index.js"),
    "editor-only": path.resolve(
      __dirname,
      "plugin/resources/js/server-conditionals",
      "editor-only.js"
    ),
    "page-only": path.resolve(
      __dirname,
      "plugin/resources/js/server-conditionals",
      "page-only.js"
    ),
    "publisher-only": path.resolve(
      __dirname,
      "plugin/resources/js/server-conditionals",
      "publisher-only.js"
    ),
    "no-site-editor": path.resolve(
      __dirname,
      "plugin/resources/js/server-conditionals",
      "no-site-editor.js"
    ),
    "post-edit-only": path.resolve(
      __dirname,
      "plugin/resources/js/server-conditionals",
      "post-edit-only.js"
    ),
  },
  output: {
    path: path.resolve(__dirname, "plugin/build"),
    filename: "[name].js",
  },
};
