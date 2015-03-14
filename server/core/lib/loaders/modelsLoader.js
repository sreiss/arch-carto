var path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');

exports.name = 'arch-loaders-modelsLoader';

exports.attach = function(opts) {
    var app = this;

    if (!app.arch.plugins)
        throw new Error('Please, load plugins first');

    var pluginsDir = app.arch.config.get('pluginsDir');
    var plugins = app.arch.plugins;
    var Types = app.arch.db.Types;

    for (var pluginName in plugins) {
        var plugin = plugins[pluginName];
        var models = plugin.models = {};
        var modelsPath = path.join(pluginsDir, pluginName, 'models');
        var modelFiles = fs.readdirSync(modelsPath);

        for (var modelFile in modelFiles) {
            var modelRequireName = path.basename(modelFiles[modelFile], '.js');
            var modelName = app.arch.utils.capitalize(modelRequireName);
            var modelPath = path.join(modelsPath, modelRequireName);

            try {
                var schemaObj = require(modelPath)(Types);
                var schema = new mongoose.Schema(schemaObj.schema);
                if (schemaObj.onSchemaReady) {
                    schemaObj.onSchemaReady(schema);
                }
                models[modelName] = mongoose.model(modelName, schema);
            } catch (err) {
                console.error('The model ' + modelName + ' could not be loaded in ' + pluginName + ' plugin');
            }
        }

        /*for (serviceName in services) {
            service = services[serviceName];
            service._models = models;
        }*/
    }
};

exports.init = function(done) {
    return done();
};