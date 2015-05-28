module.exports = function(Types, auditEvents) {

    return {
        schema: {
            rate: {type: Number, required: true, min: 0, max: 5},
            commentary: {type: String},
            userId: {type: Types.ObjectId, required: true},
            courseId: {type: Types.ObjectId, required: true, ref: 'Course'}
        }
    };

};