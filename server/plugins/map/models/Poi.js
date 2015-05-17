module.exports = function(Types) {

    return {
        extends: 'Point',
        schema: {
            properties: {
                altitude: {type: Number, required: true},
                name: {type: String, required: true},
                description: {type: String},
                type: {type: Types.ObjectId, ref: 'PoiType', required: true},
                auditEvents: [{type: Types.ObjectId, ref: 'AuditEvent', required: true}],
                medias: [{type: Types.ObjectId, ref: 'Media'}]
            }
        },
        onSchemaReady: function(bugSchema) {
            bugSchema.pre('save', function(next) {
                this.properties.entity = "POI";
                return next();
            });
        },
        priority: 10
    };
    /*return {
        schema: {
            name: {type: String, required: true},
            description: String,
            type: {type: Types.ObjectId, ref: 'PoiType', required: true},
            coordinates: {
                latitude: {type: Number, required: true},
                longitude: {type: Number, required: true}
            }
        }
    };*/

};