module.exports = function(Types) {

    return {
        schema: {
            type: String,
            features: [{
                    geometry: {
                        "type": String,
                        coordinates: [{
                            longitude: Number,
                            latitude: Number,
                            height: Number
                        }]
                    },
                    properties: {
                        name: String
                    },
                    type: String
                }]
        }

    };

};