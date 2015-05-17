module.exports = function(Types, auditEventService) {

    return {
        schema: {
            name: {type: String, required: true},
            description: {type: String},
            url: {type: String, required: true},
            auditEvents: [{type: Types.ObjectId, ref: 'AuditEvent', required: true}]
        },
        onSchemaReady: function(schema) {
            var addAuditEvent = function(eventType, model, next) {
                model.validate(function(err) {
                    if (err) {
                        return next(err);
                    }

                    var auditEvent = {
                        type: eventType,
                        entity: "MEDIA",
                        entityId: model._id
                    };
                    auditEventService.saveAuditEvent(auditEvent)
                        .then(function(auditEventId) {
                            model.auditEvents.push(auditEventId);
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