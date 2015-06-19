module.exports = function(Types, auditEventService) {

    return {
        schema: {
            name: {type: String, required: true},
            description: {type: String},
            url: {type: String, required: true},
            auditEvents: [{type: Types.ObjectId, ref: 'AuditEvent'}]
        },
        onSchemaReady: function(schema) {
            //var addAuditEvent = function(eventType, model, next) {
            //    model.validate(function(err) {
            //        if (err) {
            //            return next(err);
            //        }
            //
            //        var auditEvent = {
            //            type: eventType,
            //            entityName: 'MEDIA',
            //            entity: model._id,
            //            pendingChanges: model
            //        };
            //        auditEventService.saveAuditEvent(auditEvent)
            //            .then(function(auditEventId) {
            //                model.auditEvents.push(auditEventId);
            //                return next();
            //            })
            //            .catch(function(err) {
            //                return next(err);
            //            });
            //    });
            //};
            //
            //schema.pre('save', function(next) {
            //    var eventType;
            //    if (this._id) {
            //        eventType = 'AWAITING_UPDATE';
            //    } else {
            //        eventType = 'AWAITING_ADDITION';
            //    }
            //    addAuditEvent(eventType, this, next);
            //});
        }
    };

};