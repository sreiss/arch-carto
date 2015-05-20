var deepcopy = require('deepcopy');

module.exports = function(Types, auditEventService) {

    return {
        extends: 'Point',
        schema: {
            properties: {
                description: {type: String, required: true},
                status: {type: Types.ObjectId, ref: 'BugStatus', required: true},
                auditEvents: [{type: Types.ObjectId, ref: 'AuditEvent', required: true}]
            }
        },
        onSchemaReady: function(bugSchema) {
            bugSchema.pre('save', function(next) {
                this.properties.entity = "BUG";
                return next();
            });
        },
        priority: 10
    };

};