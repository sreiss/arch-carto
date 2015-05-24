var ObjectId = require('mongoose').Types.ObjectId;

exports.name = 'arch-validators';

exports.attach = function(opts) {
    var app = this;

    app.arch.validators = {
        isObjectId: function (value) {
            return ObjectId.isValid(value);
        },
        isArray: function (value) {
            return Array.isArray(value);
        },
        isObject: function (value) {
            return typeof value === 'object';
        }
    }
};

exports.init = function(done) {
    return done();
};