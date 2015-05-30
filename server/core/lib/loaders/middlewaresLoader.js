var path = require('path'),
    fs = require('fs');

exports.name = 'arch-loaders-middlewaresLoader';

exports.attach = function(opts) {
    var app = this;

    if (!app.arch.plugins)
        throw new Error('Please, load plugins first');

    var pluginsDir = app.arch.config.get('pluginsDir');
    var plugins = app.arch.plugins;
    var formatters = app.arch.formatters;

    for (var pluginName in plugins) {
        var plugin = plugins[pluginName];
        var pluginDependencies = plugin.plugin.dependencies;
        var middlewares = plugin.middlewares = {};
        var objectsPath = path.join(pluginsDir, pluginName, 'middlewares');
        var objectFiles = fs.readdirSync(objectsPath);

        for (var objectFile in objectFiles) {
            var objectName = path.basename(objectFiles[objectFile], '.js');
            var objectPath = path.join(objectsPath, objectName);

            var middlewareRequire = require(objectPath);
            var middlewareSignature = middlewareRequire.toString();
            var dependencyNames = middlewareSignature
                .substring(middlewareSignature.indexOf('(') + 1, middlewareSignature.indexOf(')'))
                .split(',');
            var args =[];

            dependencyNames.forEach(function(dependencyName) {
                dependencyName = dependencyName.trim();
                if (dependencyName != '') {
                    if (dependencyName === 'formatterService') {
                        args.push(formatters);
                    } else if (plugin.services[dependencyName]) {
                        args.push(plugin.services[dependencyName]);
                    } else if (pluginDependencies.length > 0) {
                        pluginDependencies.forEach(function (otherPluginName) {
                            if (!plugins[otherPluginName])
                                throw new Error("Plugin " + otherPluginName + " doesn't exist! Please remove it form " + pluginName + " plugin dependencies");

                            var otherPlugin = plugins[otherPluginName];
                            if (otherPlugin.services[dependencyName]) {
                                args.push(otherPlugin.services[dependencyName]);
                            } else {
                                throw new Error(dependencyName + ' not found in ' + pluginName + ' plugin for service ' + dependencyName);
                            }
                        });
                    } else {
                        throw new Error(dependencyName + ' not found in ' + pluginName + ' plugin for service ' + dependencyName);
                    }
                }
            });

            middlewares[objectName] = middlewareRequire.apply(this, args);
        }
    }

};

exports.init = function(done) {
    return done();
};