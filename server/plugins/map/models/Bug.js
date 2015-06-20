var deepcopy = require('deepcopy');

module.exports = function(Types, auditEventService) {

    return {
        extends: 'Point',
        schema: {
            properties: {
                description: {type: String, required: true},
                //status: {type: Types.ObjectId, ref: 'BugStatus', required: true},
                auditEvents: [{type: Types.ObjectId, ref: 'AuditEvent', required: true}]
            }
        },
        onSchemaReady: function(bugSchema) {
            bugSchema.pre('validate', function(next) {
                this.properties.entity = "BUG";
                return next();
            });
        },
        onModelReady: function(Bug) {
            Bug.collection.createIndex({geometry: '2dsphere'}, function(err, result) {
                if (err) {
                    console.error(err);
                }
            });
        },
        priority: 10
    };

};