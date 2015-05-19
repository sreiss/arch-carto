module.exports = function(Types) {

    return {
        extends: 'Point',
        schema: {
            properties: {
                paths: [{type: Types.ObjectId, ref: 'Path'}],
                auditEvents: [{type: Types.ObjectId, ref: 'AuditEvent', required: true}]
            }
        },
        onSchemaReady: function(junctionSchema) {
            junctionSchema.pre('validate', function(next) {
                this.properties.entity = "JUNCTION";
                return next();
            });
        },
        priority: 10
    };

};