var config = require('../config')
function MyPlugin(options) {
  // Configure your plugin with options...
}

MyPlugin.prototype.apply = function(compiler) {
  compiler.plugin('compilation', function(compilation) {

    compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {

       //注入公共js
      htmlPluginData.assets.js = config.build.commonResource.js.concat(htmlPluginData.assets.js)

       //注入公共css
      htmlPluginData.assets.css = config.build.commonResource.css.concat(htmlPluginData.assets.css)
      callback(null, htmlPluginData);
    });
  });
};

module.exports = MyPlugin;