var ObjectId = require('mongoose').Types.ObjectId;

var mongooseValidators = {
    isObjectId: function(value) {
        return ObjectId.isValid(value);
    },
    toObjectId: function(value) {
        if (mongooseValidators.isObjectId(value)) {
            return value;
        } else if (value._id && mongooseValidators.isObjectId(value._id)) {
            return value._id;
        } else {
            return false;
        }
    },
    toObjectIds: function(value) {
        if (!Array.isArray(value)) {
            return false;
        }
        var result = [];
        for (var i = 0; i < value.length; i += 1) {
            if (mongooseValidators.toObjectId(value[i]) === false) {
                return false;
            } else {
                if (result.indexOf(value[i])) {
                    result.push(value[i]);
                }
            }
        }
        return result;
    }
};

module.exports = mongooseValidators;