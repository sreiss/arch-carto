module.exports = function(Types) {

    return {
        schema: {
            name: {type: String, required: true},
            description: String,
            type: {type: Types.ObjectId, ref: 'PoiType', required: true},
            coordinates: {
                latitude: {type: Number, required: true},
                longitude: {type: Number, required: true}
            }
        }
    };

};