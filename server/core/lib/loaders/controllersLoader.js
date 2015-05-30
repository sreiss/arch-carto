var path = require('path'),
    fs = require('fs');

exports.name = 'arch-loaders-controllersLoader';

exports.attach = function(opts) {
    var app = this;

    if (!app.arch.plugins)
        throw new Error('Please, load plugins first');

    var pluginsDir = app.arch.config.get('pluginsDir');
    var plugins = app.arch.plugins;
    var crudControllerFactory = app.arch.factories.crudControllerFactory;

    for (var pluginName in plugins) {
        var plugin = plugins[pluginName];
        var controllers = plugin.controllers = {};
        var controllersPath = path.join(pluginsDir, pluginName, 'controllers');
        var controllerFiles = fs.readdirSync(controllersPath);

        for (var controllerFile in controllerFiles) {
            var controllerName = path.basename(controllerFiles[controllerFile], '.js');
            var controllerPath = path.join(controllersPath, controllerName);

            var service;
            var serviceName = controllerName + 'Service';
            if (!plugin.services[serviceName]) {
                console.warn('No services was found for ' + controllerName + ' in ' + pluginName + ' plugin');
                service = null;
            } else {
                service = plugin.services[serviceName];
            }

            controllers[controllerName] = require(controllerPath)(service, crudControllerFactory);
        }
    }

};

exports.init = function(done) {
    return done();
};