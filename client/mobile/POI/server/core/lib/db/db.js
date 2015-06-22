var mongoose = require('mongoose');

exports.name = 'arch-db-db';

exports.attach = function (opts) {
    var app = this;

    var config = app.arch.config;
    app.arch.db = {};

    mongoose.connect(config.get('db:url'));
};

exports.init = function (done) {
    return done();
};