var camelCase = require('camel-case');

module.exports = (function(entityName, service) {
    var _entityName = entityName;
    var _service = service;

    var _buildNormalizedQuery = function(query) {
        var options = {};
        for (var paramName in query) {
            var normilizedName = camelCase(paramName);
            var value = query[paramName];
            options[normilizedName] = value;
        };
        return options;
    };

    return {
        get: function (req, res, next) {
            var options = _buildNormalizedQuery(req.query);
            _service.get(req.params.id, options)
                .then(function (entity) {
                    res.json({
                        message: _entityName + '_RETRIEVED',
                        value: entity
                    });
                })
                .catch(function (err) {
                    next(err);
                });
        },
        getList: function (req, res, next) {
            var criterias = _buildNormalizedQuery(req.query);
            _service.getList(criterias)
                .then(function (list) {
                    res.json({
                        message: _entityName + '_LIST',
                        value: list
                    });
                })
                .catch(function (err) {
                    next(err);
                });
        },
        save: function (req, res, next) {
            var isUpdate = !!req.body._id;
            var body = req.body;
            if (req.user) {
                body._user = user;
            }
            _service.save(body)
                .then(function (savedEntity) {
                    if (!isUpdate) {
                        req.archIo.namespace.emit('new', {
                            message: 'NEW_' + _entityName,
                            value: savedEntity
                        });
                        res.json({
                            message: _entityName + '_ADDED'
                        });
                    } else {
                        req.archIo.namespace.emit('update', {
                            message: _entityName + '_UPDATE',
                            value: savedEntity
                        });
                        res.json({
                            message: _entityName + '_UPDATED'
                        })
                    }
                })
                .catch(function (err) {
                    next(err);
                });
        },
        delete: function(req, res, next) {
            _service.delete(req.params.id)
                .then(function(deletedEntity) {
                    req.archIo.namespace.emit('deleted', {
                        message: _entityName + '_DELETION',
                        value: deletedEntity
                    });
                    res.json({
                        message: _entityName + '_DELETED'
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        }
    };
});