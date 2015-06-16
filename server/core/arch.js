var path = require('path'),
    fs = require('fs'),
    config = require(path.join(__dirname, 'lib', 'config')),
    utils = require(path.join(__dirname, 'lib', 'utils')),
    expressApp = require(path.join(__dirname, 'lib', 'expressApp')),
    server = require(path.join(__dirname, 'lib', 'server')),
    crudControllerFactory = require(path.join(__dirname, 'lib', 'factories', 'crudControllerFactory')),
    crudServiceFactory = require(path.join(__dirname, 'lib', 'factories', 'crudServiceFactory')),
    controllersLoader = require(path.join(__dirname, 'lib', 'loaders', 'controllersLoader')),
    routesLoader = require(path.join(__dirname, 'lib', 'loaders', 'routesLoader')),
    modelsLoader = require(path.join(__dirname, 'lib', 'loaders', 'modelsLoader')),
    middlewaresLoader = require(path.join(__dirname, 'lib', 'loaders', 'middlewaresLoader')),
    db = require(path.join(__dirname, 'lib', 'db', 'db')),
    types = require(path.join(__dirname, 'lib', 'db', 'types')),
    auditEvent = require(path.join(__dirname, 'lib', 'audit', 'auditEvent')),
    auditEventService = require(path.join(__dirname, 'lib', 'audit', 'auditEventService')),
    servicesLoader = require(path.join(__dirname, 'lib', 'loaders', 'servicesLoader')),
    pluginLoader = require(path.join(__dirname, 'lib', 'loaders', 'pluginLoader')),
    ioServer = require(path.join(__dirname, 'lib', 'ioServer')),
    validators = require(path.join(__dirname, 'lib', 'validators')),
    formatters = require(path.join(__dirname, 'lib', 'formatters')),
    errorLoader = require(path.join(__dirname, 'lib', 'loaders', 'errorsLoader')),
    userService = require(path.join(__dirname, 'lib', 'user', 'userService')),
    userCleaner = require(path.join(__dirname, 'lib', 'user', 'userCleaner'));

exports.name = 'arch';

exports.attach = function(opts)
{
    var app = this;

    app.arch = {};
    app.arch.plugins = {};

    app.use(utils);
    app.use(config);
    app.use(errorLoader);
    app.use(db);
    app.use(types);
    app.use(validators);
    app.use(auditEvent);
    app.use(auditEventService);
    app.use(pluginLoader);
    app.use(userService);
    app.use(expressApp);
    app.use(server);
    app.use(ioServer);
    app.use(formatters);
    app.use(modelsLoader);
    app.use(crudServiceFactory);
    app.use(servicesLoader);
    app.use(middlewaresLoader);
    app.use(crudControllerFactory);
    app.use(controllersLoader);
    app.use(routesLoader);
    app.use(userCleaner);
};

exports.init = function(done)
{
    var app = this;

    var config = app.arch.config;
    var port = config.get('http:port');

    app.arch.server.listen(port, function()
    {
        var address = app.arch.server.address();
        var port = address.port || '80';
        console.log('[' + (new Date()) + '] Listening to port ' + port);
        return done();
    });
};