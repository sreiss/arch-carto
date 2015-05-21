var path = require('path'),
    fs = require('fs'),
    express = require('express');

exports.name = 'arch-loaders-routesLoader';

exports.attach = function(opts) {

};

exports.init = function(done) {
    var app = this;

    if (!app.arch.plugins)
        throw new Error('Please, load plugins first');

    var utils = app.arch.utils;
    var pluginsDir = app.arch.config.get('pluginsDir');
    var plugins = app.arch.plugins;
    var expressApp = app.arch.expressApp;

    for (pluginName in plugins) {
        var plugin = plugins[pluginName];
        var routes = plugin.routes = {};
        var controllers = plugin.controllers;
        var routesPath = path.join(pluginsDir, pluginName, 'routes');
        var routeFiles = fs.readdirSync(routesPath);
        var pluginSlug = utils.slugify(pluginName);

        for (var routeFile in routeFiles) {
            var routeName = path.basename(routeFiles[routeFile], '.js');
            var routePath = path.join(routesPath, routeName);

            try {
                var controller = controllers[routeName];
                var router = routes[routeName] = express.Router();
                require(routePath)(controller, router);
                var routeSlug = utils.slugify(routeName);
                expressApp.use('/' + pluginSlug + '/' + routeSlug, router);
            } catch (err) {
                console.error('No controller attached to ' + routeName + ' route in ' + pluginName + ' plugin');
            }
        }
    }

    // catch 404 and forward to error handler
    expressApp.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // development error handler
    // will print stacktrace
    if (expressApp.get('env') === 'development') {
        expressApp.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    expressApp.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    return done();
};