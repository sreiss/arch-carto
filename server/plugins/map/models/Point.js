module.exports = function(Types, auditEventService) {

    return {
        schema: {
            type: {type: String, required: true},
            geometry: {
                type: {type: String, required: true},
                coordinates: [Types.Mixed]
            },
            auditEvents: [{type: Types.ObjectId, ref: 'AuditEvent'}]
        },
        onSchemaReady: function(schema) {
            schema.pre('save', function(next) {
                this.type = "Feature";
                this.geometry.type = "Point";
                next();
            });
        },
        onModelReady: function(Bug) {
            Bug.schema.pre('save', function(next) {
                this.validate(function(err) {
                    if (err) {
                        return next(err);
                    }

                    var auditEvent = {
                        type: 'added',
                        entity: 'Bug'
                    };
                    auditEventService.saveAuditEvent(auditEvent)
                        .then(function(auditEventId) {
                            this.auditEvents.push(auditEventId);
                            return next();
                        })
                        .catch(function(err) {
                            return next(err);
                        });
                    return next();
                });
            });
        },
        priority: 1
    };

};