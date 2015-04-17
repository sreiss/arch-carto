var path = require('path'),
    fs = require('fs');

exports.name = 'arch-loaders-plugin';

exports.attach = function(opts)
{
    var app = this;

    var config = app.arch.config;
    var pluginsDir = config.get('pluginsDir');
    var plugins = app.arch.plugins;
    var foundPlugins = fs.readdirSync(pluginsDir);
    var pluginsObjs = [];

    foundPlugins.forEach(function(pluginDirName)
    {
        var pluginFilePath = path.join(pluginsDir, pluginDirName, 'plugin');
        var plugin =
        {
            name: pluginDirName,
            plugin: require(pluginFilePath)
        };

        pluginsObjs.push(plugin);
    });

    pluginsObjs.sort(function(a, b) { return a.plugin.priority - b.plugin.priority; });

    for(var i = 0; i < pluginsObjs.length; i++)
    {
        plugins[pluginsObjs[i].name] = pluginsObjs[i];
    }
};

exports.init = function(done)
{
    return done();
};
