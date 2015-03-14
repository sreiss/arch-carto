var mongoose = require('mongoose');

exports.name = 'arch-db-types';

exports.attach = function(opts) {
    var app = this;

    app.arch.db.Types = {
        Array: mongoose.Schema.Types.Array,
        Mixed: mongoose.Schema.Types.Mixed,
        ObjectId: mongoose.Schema.Types.ObjectId
    };
};

exports.init = function(done) {
    return done();
};