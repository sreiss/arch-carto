module.exports = function(Types) {

    return {
        schema: {
            description: {type: String, required: true},
            coordinates: {
                latitude: {type: Number, required: true},
                longitude: {type: Number, required: true}
            }
        }
    };

};