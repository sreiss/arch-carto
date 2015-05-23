var deepcopy = require('deepcopy');

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
            var addAuditEvent = function(eventType, model, next) {
                model.type = "Feature";
                model.geometry.type = "Point";
                model.validate(function(err) {
                    if (err) {
                        return next(err);
                    }

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
                });
            };

            schema.pre('save', function(next) {
                addAuditEvent('AWAITING_ADDITION', this, next);
            });

            schema.pre('update', function(next) {
                addAuditEvent('AWAITING_UPDATE', this, next);
            });
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

            Point.schema.post('update', function(model, next) {
                populateLastEvent(model, next);
            });
        },
        priority: 1
    };

};