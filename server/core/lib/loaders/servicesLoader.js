var path = require('path'),
    fs = require('fs');

exports.name = 'arch-loaders-servicesLoader';

exports.attach = function(opts) {
    var app = this;

    var plugins = app.arch.plugins;
    var config = app.arch.config;
    var utils = app.arch.utils;
    var formatters = app.arch.formatters;
    var auditEventService = app.arch.audit.auditEventService;

    for (var pluginName in plugins) {
        var plugin = plugins[pluginName];
        plugin.services = {};
        var pluginsDir = config.get('pluginsDir');
        var pluginServicesPath = path.join(pluginsDir, pluginName, 'services');
        var foundServices = fs.readdirSync(pluginServicesPath);

        for (var serviceFile in foundServices) {
            var serviceName = path.basename(foundServices[serviceFile], '.js');

            plugin.services[serviceName] = {};
        }
    }

    for (var pluginName in plugins) {
        var plugin = plugins[pluginName];

        for (var serviceName in plugin.services) {
            var pluginServicesPath = path.join(pluginsDir, pluginName, 'services');
            var servicePath = path.join(pluginServicesPath, serviceName);
            var serviceRequire = require(servicePath);

            var serviceSignature = serviceRequire.toString();
            var dependencyNames = serviceSignature
                .substring(serviceSignature.indexOf('(') + 1, serviceSignature.indexOf(')'))
                .split(',');

            var serviceArgs = [];
            var pluginDependencies = plugin.plugin.dependencies || [];

            dependencyNames.forEach(function(dependencyName) {
                dependencyName = dependencyName.trim();
                if (dependencyName != '') {
                    if(dependencyName == 'config') {
                        serviceArgs.push(config);
                    } else if (dependencyName == 'auditEventService') {
                        serviceArgs.push(auditEventService);
                    } else if (dependencyName == 'formatterService') {
                        serviceArgs.push(formatters);
                    } else if (plugin.models[dependencyName]) {
                        serviceArgs.push(plugin.models[dependencyName]);
                    } else if (plugin.services[dependencyName]) {
                        serviceArgs.push(plugin.services[dependencyName]);
                    } else if (pluginDependencies.length > 0) {
                        pluginDependencies.forEach(function (otherPluginName) {
                            if (!plugins[otherPluginName])
                                throw new Error("Plugin " + otherPluginName + " doesn't exist! Please remove it form " + pluginName + " plugin dependencies");

                            var otherPlugin = plugins[otherPluginName];
                            if (otherPlugin.models[dependencyName]) {
                                serviceArgs.push(otherPlugin.models[dependencyName]);
                            } else if (otherPlugin.services[dependencyName]) {
                                serviceArgs.push(otherPlugin.services[dependencyName]);
                            } else {
                                throw new Error(dependencyName + ' not found in ' + pluginName + ' plugin for service ' + serviceName);
                            }
                        });
                    } else {
                        throw new Error(dependencyName + ' not found in ' + pluginName + ' plugin for service ' + serviceName);
                    }
                }
            });

            var returnedService = serviceRequire.apply(this, serviceArgs);
            utils.extend(plugin.services[serviceName], returnedService);
        }

        // Dependency injection
        /*
         for (pluginServiceName in pluginServices) {
         var serviceSignature = pluginServices[pluginServiceName].toString();
         var dependencyNames = serviceSignature
         .substring(serviceSignature.indexOf('(') + 1, serviceSignature.indexOf(')'))
         .split(',');

         var serviceArgs = [];
         dependencyNames.forEach(function(dependencyName) {
         dependencyName = dependencyName.trim();
         if (pluginModels[dependencyName]) {
         serviceArgs.push(pluginModels[dependencyName]);
         } else if (pluginServices[dependencyName]) {
         serviceArgs.push(pluginServices[dependencyName]);
         } else {
         serviceArgs.push(null);
         }
         });

         pluginServices[pluginServiceName] = pluginServices[pluginServiceName].apply(this, serviceArgs);
         }*/
    }
};

exports.init = function(done) {
    return done();
};