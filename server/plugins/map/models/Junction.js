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
                this.properties.auditEvents = this.properties.auditEvents || [];
                return next();
            });
        },
        onModelReady: function(Junction) {
            Junction.collection.createIndex({geometry: '2dsphere'}, function(err, result) {
                if (err) {
                    console.error(err);
                }
            });
        },
        priority: 10
    };

};