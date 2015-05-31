var path = require('path'),
    extend = require('extend'),
    crudService = require(path.join('..', 'objects', 'crudService'));

exports.name = 'arch.factories.crudServiceFactory';

exports.attach = function(opts) {
    var app = this;

    app.arch.factories = app.arch.factories || {};

    var auditEventService = app.arch.audit.auditEventService;

    app.arch.factories.crudServiceFactory = {
        init: function(entityName, Model, populates) {
            return crudService(entityName, Model, auditEventService, populates);
        },
        extend: function(entityName, Model, populates, extension) {
            var service = crudService(entityName, Model, auditEventService, populates);
            return extend(true, {}, service, extension);
        }
    };
};

exports.init = function(done) {
    return done();
};
