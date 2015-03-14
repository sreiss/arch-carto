module.exports = function(Types) {

    return {
        schema: {
            name: {type: String, required: true},
            description: String,
            points: [
                {
                    coordinates: {
                        latitude: {type: Number, required: true},
                        longitude: {type: Number, required: true}
                    }
                }
            ]
        }
    };

};