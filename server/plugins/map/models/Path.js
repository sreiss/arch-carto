module.exports = function(Types) {

    return {
        schema: {
            type: {type: String, required: true},
            properties: {
                coating: {type: String}
            },
            geometry: {
                type: {type: String, required: true},
                coordinates: [[Number]]
            }
        }
    };

};