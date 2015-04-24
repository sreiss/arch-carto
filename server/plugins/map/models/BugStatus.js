module.exports = function(Types) {

    return {
        schema: {
            name: {type: String, required: true},
            description: {type: String, required: true}
        },
        priority: 5
    };

};