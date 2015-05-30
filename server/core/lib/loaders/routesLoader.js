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

    var pluginsDir = app.arch.config.get('pluginsDir');
    var plugins = app.arch.plugins;
    var expressApp = app.arch.expressApp;
    var ioServer = app.arch.ioServer;
    var utils = app.arch.utils;

    for (var pluginName in plugins) {
        var plugin = plugins[pluginName];
        var pluginDependencies = plugin.plugin.dependencies;
        var routes = plugin.routes = {};
        var controllers = plugin.controllers;
        var routesPath = path.join(pluginsDir, pluginName, 'routes');
        var routeFiles = fs.readdirSync(routesPath);

        for (var routeFile in routeFiles) {
            var routeName = path.basename(routeFiles[routeFile], '.js');
            var routePath = path.join(routesPath, routeName);

            try {
                var controller = controllers[routeName];
                var router = routes[routeName] = express.Router();

                var args = [controller, router];

                var routeRequire = require(routePath);

                var routeSignature = routeRequire.toString();
                var dependencyNames = routeSignature
                    .substring(routeSignature.indexOf('(') + 1, routeSignature.indexOf(')'))
                    .split(',');

                var fullRoute = '/' + utils.slugify(pluginName) + '/' + utils.slugify(routeName);

                (function(router, ioServer) {
                    var _socketNamespace = ioServer
                        .of(fullRoute);

                    var archIo = {};

                    var socketNamespace = _socketNamespace
                        .on('connection', function (socket) {
                            // Adding websocket support
                            archIo.socket = socket;
                            archIo.namespace = socketNamespace;
                        });

                    router.use(function (req, res, next) {
                        req.archIo = archIo;
                        return next();
                    });
                })(router, ioServer);

                for (var i = 2; i < dependencyNames.length; i++) {
                    var dependencyName = dependencyNames[i].trim();
                    if (dependencyName != '') {
                        /*
                        if (dependencyName == routeName + 'Socket') {
                            return function() {};
                            /*args.push(function(handlers) {
                                var _socketNamespace = ioServer
                                    .of(fullRoute);

                                var socketNamespace = _socketNamespace
                                    .on('connection', function (socket) {
                                        for (var handler in handlers) {
                                            socket.on(handler, handlers[handler](socket, socketNamespace));
                                        }
                                    });
                            })
                            }*/
                        if (plugin.middlewares[dependencyName]) {
                            args.push(plugin.middlewares[dependencyName]);
                        } else if (pluginDependencies.length > 0) {
                            pluginDependencies.forEach(function (otherPluginName) {
                                if (!plugins[otherPluginName])
                                    throw new Error("Plugin " + otherPluginName + " doesn't exist! Please remove it form " + pluginName + " plugin dependencies");

                                var otherPlugin = plugins[otherPluginName];
                                console.log(otherPlugin);
                                if (otherPlugin.middlewares[dependencyName]) {
                                    args.push(otherPlugin.middlewares[dependencyName]);
                                } else {
                                    throw new Error(dependencyName + ' not found in ' + pluginName + ' plugin for service ' + serviceName);
                                }
                            });
                        } else {
                            throw new Error(dependencyName + ' not found in ' + pluginName + ' plugin for service ' + serviceName);
                        }
                    }
                }

                // Now we apply the args to the route
                routeRequire.apply(this, args);
                expressApp.use(fullRoute, router);
                plugin.router = router;
            } catch (err) {
                console.error('No controller attached to ' + routeName + ' route in ' + pluginName + ' plugin');
                console.error(err);
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
            res.status(err.status || 500)
                .send(err);
        });
    }

    // production error handler
    // no stacktraces leaked to user
    expressApp.use(function (err, req, res, next) {
        res.status(err.status || 500)
            .send(err);
    });

    return done();
};