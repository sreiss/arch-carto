module.exports = function(Types, auditEventService) {

    return {
        extends: 'Point',
        schema: {
            properties: {
                altitude: {type: Number, required: true},
                description: {type: String, required: true},
                status: {type: Types.ObjectId, ref: 'BugStatus', required: true},
                auditEvents: [{type: Types.ObjectId, ref: 'AuditEvent', required: true}]
            }
        },
        onSchemaReady: function(bugSchema) {
            bugSchema.pre('save', function(next) {
                this.properties.entity = "Bug";
                return next();
            });
        },
        priority: 10
    };

};