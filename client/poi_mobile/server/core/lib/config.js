var nconf = require('nconf'),
    path = require('path');

exports.name = 'arch-config';

exports.attach = function(opts) {
    var app = this;

    var utils = app.arch.utils;
    if (!utils) {
        throw new Error('Please, load utils before config');
    }

    var config = app.arch.config = nconf
        .argv()
        .env()
        .file({file: path.join(__dirname, '..', '..', 'config', 'config.json')});


    var pluginsDir = path.join(__dirname, '..', '..', (config.get('pluginsDir') || 'plugins'));
    var httpPort = utils.normalizePort(config.get('http:port')) || 3001;
    var dbUrl = config.get('db:url') || 'mongodb://localhost/archCore';

    config.set('pluginsDir', pluginsDir);
    config.set('http:port', httpPort);
    config.set('db:url', dbUrl);
};

exports.init = function(done) {
    var app = this;

    var config = app.arch.config;
    var plugins = app.arch.plugins;
    var pluginsDir = config.get('pluginsDir');

    /*
    config.set('plugins', 'ok');
    var pluginsConf = config.get('plugins');

    for (var pluginName in plugins) {
        var plugin = plugins[pluginName];
        config.add('plugins:' + pluginName, {type: 'file', file: path.join(pluginsDir, pluginName, 'plugin.js')});
        config.load();

        var pluginsConf = config.get('plugins');
        var dependencies = config.get('plugins:' + pluginName).get('dependencies') || [];

        config.set('plugins:' + pluginName + ':dependencies', dependencies);
    }*/

    return done();
};