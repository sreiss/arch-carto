var ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    isObjectId: function(value) {
        return ObjectId.isValid(value);
    }
};