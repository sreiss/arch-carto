var path = require('path');

exports.name = 'arch-formatters';

exports.attach = function(options) {
    var app = this;

    var validators = app.arch.validators;

    var formatters = app.arch.formatters =  {
        toObjectId: function (value) {
            if (validators.isObjectId(value)) {
                return value;
            } else if (value._id && validators.isObjectId(value._id)) {
                return value._id;
            } else {
                return false;
            }
        },
        toObjectIds: function (value) {
            if (!Array.isArray(value)) {
                return false;
            }
            var result = [];
            for (var i = 0; i < value.length; i += 1) {
                var newValue = formatters.toObjectId(value[i]);
                if (newValue === false) {
                    return false;
                } else {
                    result.push(newValue);
                    /*
                    if (result.indexOf(value[i])) {
                        result.push(value[i]);
                    }
                    */
                }
            }
            return result;
        }
    };
};

exports.init = function(done) {
    return done();
};