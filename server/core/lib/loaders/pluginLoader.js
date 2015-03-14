var path = require('path'),
    fs = require('fs');

exports.name = 'arch-loaders-plugin';

exports.attach = function(opts) {
    var app = this;

    var config = app.arch.config;
    var pluginsDir = config.get('pluginsDir');
    var plugins = app.arch.plugins;

    var foundPlugins = fs.readdirSync(pluginsDir);
    foundPlugins.forEach(function(pluginDirName) {
        var plugin = plugins[pluginDirName] = {};
        var pluginFilePath = path.join(pluginsDir, pluginDirName, 'plugin');
        plugin.plugin = require(pluginFilePath);
    });
};

exports.init = function(done) {
    return done();
};
