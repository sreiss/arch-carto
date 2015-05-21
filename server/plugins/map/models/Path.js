var deepcopy = require('deepcopy');

module.exports = function(Types, auditEventService) {

    return {
        schema: {
            type: {type: String, required: true},
            properties: {
                auditEvents: [{type: Types.ObjectId, ref: 'AuditEvent'}],
                coating: {type: String},
                medias: [{type: Types.ObjectId, ref: 'Media'}]
            },
            geometry: {
                type: {type: String, required: true},
                coordinates: [Types.Mixed]
            }
        },
        onSchemaReady: function(schema) {
            var addAuditEvent = function(eventType, model, next) {
                model.type = "Feature";
                model.geometry.type = "LineString";
                model.validate(function(err) {
                    if (err) {
                        return next(err);
                    }

                    var auditEvent = {
                        type: eventType,
                        entity: "PATH",
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
        }
    };

};