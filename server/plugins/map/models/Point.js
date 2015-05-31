var deepcopy = require('deepcopy'),
    Q = require('q');

module.exports = function(Types, auditEventService) {

    return {
        schema: {
            type: {type: String, required: true},
            properties: {
                auditEvents: [{type: Types.ObjectId, ref: 'AuditEvent'}],
                entity: {type: String, required: true}
            },
            geometry: {
                type: {type: String, required: true},
                coordinates: [Types.Mixed]
            }
        },
        onSchemaReady: function(schema) {
            schema.pre('validate', function(next) {
                this.type = 'Feature';
                this.geometry.type = 'Point';
                return next();
            });

            schema.pre('save', function(next) {
                var model = this;
                var entityName = model.properties.entity;
                if (model.isNew) {
                    auditEventService.awaitingAddition(entityName, model, false)
                        .then(function(auditEventId) {
                            model.properties.auditEvents.unshift(auditEventId);
                            next();
                        })
                        .catch(function(err) {
                            next(err);
                        });
                } else {
                    auditEventService.awaitingUpdate(entityName, model, false)
                        .then(function(auditEventId) {
                            model.properties.auditEvents.unshift(auditEventId);
                            next();
                        })
                        .catch(function(err) {
                            next(err);
                        });
                }
            });

            schema.methods.delete = function() {
                var model = this;
                var entityName = model.properties.entity;
                return auditEventService.awaitingDeletion(entityName, model, false);
            };

            /*
            schema.post('save', function(model, next) {
                if (model === null) {
                    next(new Error('CANNOT_ATTACH_AUDIT_EVENT_TO_EMPTY_MODEL'));
                } else {
                    var entityName = model.properties.entity;
                    auditEventService.awaitingAddition(entityName, model, false);
                }
            });

            schema.post('findOneAndUpdate', function(model, next) {
                if (model === null) {
                    next(new Error('CANNOT_ATTACH_AUDIT_EVENT_TO_EMPTY_MODEL'));
                } else {
                    var entityName = model.properties.entity;
                    auditEventService.awaitingUpdate(entityName, model, false);
                }
            });
            */

            /*
            var addAuditEvent = function(eventType, model, next) {
                var auditEvent = {
                    type: eventType,
                    entity: model.properties.entity,
                    entityId: model._id,
                    pendingChanges: deepcopy(model._doc)
                };
                auditEventService.saveAuditEvent(auditEvent)
                    .then(function(auditEventId) {
                        model.properties.auditEvents.push(auditEventId);
                        return next();
                    })
                    .catch(function(err) {
                        return next(err);
                    });
            };

            schema.post('save', function(model, next) {
                addAuditEvent('AWAITING_ADDITION', this, next);
            });

            schema.post('findOneAndUpdate', function(model, next) {
                addAuditEvent('AWAITING_UPDATE', model, next);
            });

            schema.methods.delete = function() {
                var model = this;
                var auditEvent = {
                    type: 'DELETED',
                    entity: model.properties.entity,
                    entityId: model._id,
                    pendingChanges: deepcopy(model._doc)
                };
                return auditEventService.saveAuditEvent(auditEvent)
                    .then(function(auditEventId) {
                        model.properties.auditEvents.push(auditEventId);
                    });
            };
            */
        },
        onModelReady: function(Point) {
            var populateLastEvent = function(model, next) {
                Point.populate(model, {
                    path: 'properties.auditEvents',
                    limit: 1
                }, function(err, point) {
                    return next(point);
                });
            };

            Point.schema.post('save', function(model, next) {
                populateLastEvent(model, next);
            });

            Point.schema.post('findOneAndUpdate', function(model, next) {
                populateLastEvent(model, next);
            });
        },
        priority: 1
    };

};