var path = require('path'),
    crudController = require(path.join('..', 'objects', 'crudController'));

exports.name = 'arch.factories.crudControllerFactory';

exports.attach = function(opts) {
    var app = this;

    app.arch.factories = app.arch.factories || {};

    app.arch.factories.crudControllerFactory = function(entityName, service) {
        return crudController(entityName, service);
    };
};

exports.init = function(done) {
    return done();
};
