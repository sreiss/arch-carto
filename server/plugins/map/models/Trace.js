module.exports = function(Types) {

    return {
        schema: {
            type: String,
            features: [
                {
                    type: String,
                    properties: {
                        name: String
                    },
                    geometry: {
                        "type": String,
                        coordinates: [{
                            longitude: Number,
                            latitude: Number,
                            height: Number
                        }]
                    }
                }]
        }

    };

};