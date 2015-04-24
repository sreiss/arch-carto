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
                        entity: model.properties.entity
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
                addAuditEvent('awaitingAddition', this, next);
            });

            schema.pre('update', function(next) {
                addAuditEvent('awaitingUpdate', this, next);
            });
        },
        onModelReady: function(Point) {
        },
        priority: 1
    };

};