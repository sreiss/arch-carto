module.exports = function(Types) {

    return {
        schema: {
            type: String,
            features: [{
                    geometry: {
                        "type": String,
                        coordinates: [{
                            longitude: Number,
                            latitude: Number,
                            height: Number
                        }]
                    },
                    properties: {
                        name: String
                    },
                    type: String
                }]
        },
        onSchemaReady: function(schema) {
            var addAuditEvent = function (eventType, model, next) {
                model.type = "Feature";
                model.geometry.type = "LineString";
                model.validate(function (err) {
                    if (err) {
                        return next(err);
                    }

                    var auditEvent = {
                        type: eventType,
                        entity: "TRACE",
                        entityId: model._id,
                        pendingChanges: deepcopy(model._doc)
                    };
                    auditEventService.saveAuditEvent(auditEvent)
                        .then(function (auditEventId) {
                            model.properties.auditEvents.push(auditEventId);
                            return next();
                        })
                        .catch(function (err) {
                            return next(err);
                        });
                });
            };

            schema.pre('save', function (next) {
                addAuditEvent('ADDED', this, next);
            });

            schema.pre('update', function (next) {
                addAuditEvent('UPDATED', this, next);
            });
        }
    };

};