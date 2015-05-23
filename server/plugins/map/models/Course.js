var deepcopy = require('deepcopy');

module.exports = function(Types, auditEventService) {

    return {
        schema: {
            type: {type: String, require: true},
            properties: {
                author: {type: Types.ObjectId},
                commentary: {type: String},
                difficulty: {type: String},
                public: {type: Boolean, required: true},
                auditEvents: [{type: Types.ObjectId, ref: 'AuditEvent'}]
            },
            features: [
                {type: Types.ObjectId, ref: 'Path'}
            ]
        },
        onSchemaReady: function(schema) {
            var addAuditEvent = function(eventType, model, next) {
                model.type = "FeatureCollection";
                model.properties.public = model.properties.public || false;
                model.validate(function(err) {
                    if (err) {
                        return next(err);
                    }

                    var auditEvent = {
                        type: eventType,
                        entity: 'COURSE',
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
        onModelReady: function(Course) {
            var populateLastEvent = function(model, next) {
                Course.populate(model, {
                    path: 'properties.auditEvents',
                    limit: 1
                }, function(err, course) {
                    return next(course);
                });
            };

            Course.schema.post('save', function(model, next) {
                populateLastEvent(model, next);
            });

            Course.schema.post('update', function(model, next) {
                populateLastEvent(model, next);
            });
        }
    }
};