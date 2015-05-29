var deepcopy = require('deepcopy');

module.exports = function(Types, auditEventService) {

    return {
        schema: {
            type: {type: String, require: true},
            properties: {
                author: {type: Types.ObjectId},
                commentary: {type: String},
                difficulty: {type: String},
                length: {type: Number},
                public: {type: Boolean, required: true},
                auditEvents: [{type: Types.ObjectId, ref: 'AuditEvent'}]
            },
            geometry: {
                type: {type: String, required: true},
                coordinates: [{type: Types.Mixed, required: true}]
            }
            //features: [
            //{type: Types.ObjectId, ref: 'Path'}
            //]
        },
        onSchemaReady: function(schema) {
            schema.pre('validate', function(next) {
                this.type = 'Feature';
                this.geometry.type = 'LineString';
                return next();
            });

            var addAuditEvent = function(eventType, model, next) {
                //model.type = "FeatureCollection";
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

            schema.post('save', function(model, next) {
                addAuditEvent('AWAITING_ADDITION', model, next);
            });

            schema.post('update', function(model, next) {
                addAuditEvent('AWAITING_UPDATE', model, next);
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