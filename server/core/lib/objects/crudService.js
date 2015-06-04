var extend = require('extend'),
    Q = require('q'),
    ArchError = GLOBAL.ArchError;

module.exports = (function(entityName, Model, auditEventService, populates) {
    var _entityName = entityName;
    var _Model = Model;
    var _populates = populates || {};

    var service = {
        get: function(id) {
            var deferred = Q.defer();

            var query = _Model.findById(id);

            if (_populates.get && Array.isArray(_populates.get)) {
                _populates.get.forEach(function(populate) {
                    query.populate(populate);
                });
            } else if (_populates.get && (typeof _populates.get === 'object')) {
                query.populate(_populates.get);
            }

            query.exec(function(err, model) {
                if (err) {
                    deferred.reject(err);
                } else if (model === null) {
                    deferred.reject(new ArchError(_entityName + '_NOT_FOUND', 404));
                } else {
                    deferred.resolve(model);
                }
            });

            return deferred.promise;
        },
        getList: function(criterias) {
            var deferred = Q.defer();

            criterias = criterias || {};

            var query = _Model.find(criterias);

            if (_populates.getList && Array.isArray(_populates.getList)) {
                _populates.getList.forEach(function(populate) {
                    query.populate(populate);
                });
            } else if (_populates.getList && (typeof _populates.getList === 'object')) {
                query.populate(_populates.getList);
            }

            query.exec(function(err, models) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(models);
                }
            });

            return deferred.promise;
        },
        save: function(rawModel) {
            var deferred = Q.defer();

            if (rawModel._id) {
                var id = rawModel._id;
                delete rawModel._id;
                _Model.findById(id, function(err, model) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        auditEventService.awaitingUpdate(_entityName, model)
                            .then(function(auditEventId) {
                                var auditEvents = model.properties.auditEvents || model.auditEvents;
                                auditEvents.push(auditEventId);
                                model.save(function(err, savedModel) {
                                    if (err) {
                                        deferred.reject(err);
                                    } else {
                                        if (_populates.save && Array.isArray(_populates.save)) {
                                            _populates.save.forEach(function(populate) {
                                                _Model.populate(savedModel, populate, function(err, populatedModel) {
                                                    if (err) {
                                                        deferred.reject(err);
                                                    } else {
                                                        deferred.resolve(populatedModel);
                                                    }
                                                });
                                            });
                                        } else if (_populates.save && (typeof _populates.save === 'object')) {
                                            _Model.populate(savedModel, populate, function(err, populatedModel) {
                                                if (err) {
                                                    deferred.reject(err);
                                                } else {
                                                    deferred.resolve(populatedModel);
                                                }
                                            });
                                        } else {
                                            deferred.resolve(savedModel);
                                        }
                                    }
                                });
                            })
                            .catch(function(err) {
                                deferred.reject(err);
                            });
                    }
                });
            } else {
                var model = new _Model(rawModel);
                model.save(function(err, savedModel) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(savedModel);
                    }
                });
            }

            return deferred.promise;
        },
        delete: function(id) {
            var deferred = Q.defer();

            _Model.findOne({_id: id}, function(err, model) {
                if (!model.delete) {
                    deferred.reject(new ArchError('TO_USE_CRUD_SERVICE_PLEASE_IMPLEMENT_DELETE_IN_MODEL'));
                }
                if (err) {
                    deferred.reject(err);
                } else if (model !== null) {
                    model.delete()
                        .then(function(deletedModel) {
                            deferred.resolve(deletedModel);
                        })
                        .catch(function(err) {
                            deferred.reject(err);
                        })
                } else {
                    deferred.reject(new ArchError('THE_SPECIEFIED_' + _entityName + '_DOES_NOT_EXISTS', 404));
                }
            });

            return deferred.promise;
        }
    };

    return service;
});