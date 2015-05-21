var ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    isObjectId: function(value) {
        return ObjectId.isValid(value);
    },
    toObjectId: function(value) {
        if (this.isObjectId(value)) {
            return value;
        } else if (value._id && this.isObjectId(value._id)) {
            return value;
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
            if (this.toObjectId(value[i]) === false) {
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