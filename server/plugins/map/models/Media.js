module.exports = function(Types, auditEventService) {

    return {
        schema: {
            name: {type: String, required: true},
            description: {type: String},
            url: {type: String, required: true},
            auditEvents: [{type: Types.ObjectId, ref: 'AuditEvent', required: true}]
        },
        onSchemaReady: function(bugSchema) {
            bugSchema.pre('save', function(next) {
                this.entity = "Media";
                return next();
            });
        }
    };

};