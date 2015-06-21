module.exports = function(Types, auditEventService) {

    return {
        extends: 'Point',
        schema: {
            properties: {
                name: {type: String, required: true},
                description: {type: String},
                type: {type: Types.ObjectId, ref: 'PoiType', required: true},
                auditEvents: [{type: Types.ObjectId, ref: 'AuditEvent', required: true}],
                medias: [{type: Types.ObjectId, ref: 'Media'}]
            }
        },
        onSchemaReady: function(schema) {
            schema.pre('save', function(next) {
                return next();
            });

            auditEventService.attachAuditEvents(schema, 'POI');
        },
        onModelReady: function(Poi) {
            Poi.collection.createIndex({geometry: '2dsphere'}, function(err, result) {
                if (err) {
                    console.error(err);
                }
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