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

    for (var pluginName in plugins)
    {
        var plugin = plugins[pluginName];
        var models = plugin.models = {};
        var modelsPath = path.join(pluginsDir, pluginName, 'models');
        var modelFiles = fs.readdirSync(modelsPath);
        var schemaObjs = [];

        for(var modelFile in modelFiles)
        {
            var modelRequireName = path.basename(modelFiles[modelFile], '.js');
            var modelName = app.arch.utils.capitalize(modelRequireName);
            var modelPath = path.join(modelsPath, modelRequireName);
            var schemaObj = require(modelPath)(Types);

            schemaObj.modelName = modelName;
            schemaObj.priority = schemaObj.priority || 1;
            schemaObjs.push(schemaObj);
        }

        schemaObjs.sort(function(a, b) { return a.priority - b.priority; });

        for(var i = 0; i < schemaObjs.length; i++)
        {
            try
            {
                var schema = new mongoose.Schema(schemaObjs[i].schema);

                if(schemaObjs[i].onSchemaReady)
                {
                    schemaObjs[i].onSchemaReady(schema);
                }
                models[schemaObjs[i].modelName] = mongoose.model(schemaObjs[i].modelName, schema);
            }
            catch (err)
            {
                console.error('The model ' + schemaObjs[i].modelName + ' could not be loaded in ' + pluginName + ' plugin');
            }
        }
    }
};

exports.init = function(done) {
    return done();
};