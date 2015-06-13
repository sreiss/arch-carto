var deepcopy = require('deepcopy');

module.exports = function(Types, auditEventService) {

    return {
        schema: {
            type: {type: String, required: true},
            properties: {
                auditEvents: [{type: Types.ObjectId, ref: 'AuditEvent'}],
                coating: {type: Types.ObjectId, ref: 'Coating'},
                medias: [{type: Types.ObjectId, ref: 'Media'}],
                length : {type: Number, ref: 'Length'},
                dPlus : {type: Number, ref: "dPLus"},
                dMinus : {type: Number, ref: "dMinus"}

            },
            geometry: {
                type: {type: String, required: true},
                coordinates: [Types.Mixed]
            }
        },
        onSchemaReady: function(schema) {
            schema.pre('validate', function(next) {
                this.type = "Feature";
                this.geometry.type = "LineString";
                return next();
            });
            /*
            var addAuditEvent = function(eventType, model, next) {
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
            */
        },
        priority: 1
    };

};