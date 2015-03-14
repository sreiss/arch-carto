var express = require('express'),
    logger = require('morgan'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http = require('http');

exports.name = 'arch-http';

exports.attach = function(opts) {
    var app = this;

    var expressApp = app.arch.expressApp = express();

    expressApp.set('views', path.join(__dirname, '..', 'views'));
    expressApp.set('view engine', 'jade');

    expressApp.use(logger('dev'));
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({extended: false}));
    expressApp.use(cookieParser());
    expressApp.use(express.static(path.join(__dirname, '..', 'public')));
};

exports.init = function (done) {
    return done();
};
