module.exports = function(Types, auditEventService) {

    return {
        extends: 'Point',
        schema: {
            properties: {
                altitude: {type: Number, required: true},
                description: {type: String, required: true},
                status: {type: Types.ObjectId, ref: 'BugStatus', required: true},
                auditEvent: [{type: Types.ObjectId, ref: 'AuditEvent', required: true}]
            }
        },
        onSchemaReady: function(bugSchema) {
            bugSchema.pre('save', function(next) {
                this.properties.auditEvent.entity = "Bug";
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
        priority: 10
    };

};