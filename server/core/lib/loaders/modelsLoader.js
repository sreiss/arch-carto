var path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend');

exports.name = 'arch-loaders-modelsLoader';

exports.attach = function(opts) {
    var app = this;

    if (!app.arch.plugins)
        throw new Error('Please, load plugins first');

    var pluginsDir = app.arch.config.get('pluginsDir');
    var plugins = app.arch.plugins;
    var Types = app.arch.db.Types;
    var auditEventService = app.arch.audit.auditEventService;
    var formatters = app.arch.formatters;
    var validators = app.arch.validators;

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
            var schemaObj = require(modelPath)(Types, auditEventService);

            schemaObj.modelName = modelName;
            schemaObj.priority = schemaObj.priority || 1;
            schemaObjs.push(schemaObj);
        }

        schemaObjs.sort(function(a, b) { return a.priority - b.priority; });

        for(var i = 0; i < schemaObjs.length; i++)
        {
            /*try
            {
            */
                var schemaObj = schemaObjs[i];
                var schema;

                if(schemaObj.extends)
                {
                    var toExtend = schemaObj.extends;
                    var filteredSchemas = schemaObjs.filter(function(value) {
                        return value.modelName == toExtend;
                    });

                    if (filteredSchemas.length > 0) {
                        schema = schemaObj.schemaInstance = filteredSchemas[0].schemaInstance.extend(schemaObj.schema);
                    }
                } else {
                    schema = schemaObj.schemaInstance = new mongoose.Schema(schemaObj.schema);
                }
                if(schemaObj.onSchemaReady)
                {
                    schemaObj.onSchemaReady(schema, formatters, validators);
                }
                models[schemaObj.modelName] = mongoose.model(schemaObj.modelName, schema);
                if (schemaObj.onModelReady)
                {
                    schemaObj.onModelReady(models[schemaObj.modelName], formatters, validators);
                }
            /*
            }
            catch (err)
            {
                console.error('The model ' + schemaObj.modelName + ' could not be loaded in ' + pluginName + ' plugin', err);
            }*/
        }
    }
};

exports.init = function(done) {
    return done();
};