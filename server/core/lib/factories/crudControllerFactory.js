var path = require('path'),
    extend = require('extend'),
    crudController = require(path.join('..', 'objects', 'crudController'));

exports.name = 'arch.factories.crudControllerFactory';

exports.attach = function(opts) {
    var app = this;

    app.arch.factories = app.arch.factories || {};

    app.arch.factories.crudControllerFactory = {
        init: function(entityName, service) {
            return crudController(entityName, service);
        },
        extend: function(entityName, service, extension) {
            var controller = crudController(entityName, service);
            return extend(true, {}, controller, extension);
        }
    };
};

exports.init = function(done) {
    return done();
};
