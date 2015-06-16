var express = require('express'),
    logger = require('morgan'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    multer = require('multer'),
    http = require('http'),
    fs = require('fs');

exports.name = 'arch-http';

exports.attach = function(opts) {
    var app = this;

    var expressApp = app.arch.expressApp = express();
    var utils = app.arch.utils;
    var validators = app.arch.validators;
    var config = app.arch.config;

    // Allow Cross Origin
    var allowedOrigins = config.get('http:allowedOrigins');
    expressApp.use(function(req, res, next)
    {
        var origin = req.headers.origin;
        var method = req.method;

        if(allowedOrigins.indexOf(origin) > -1)
        {
            var headers =
            {
                'Access-Control-Allow-Origin' : origin,
                'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Credentials' : true,
                'Access-Control-Allow-Headers' : 'Content-Type'
            }

            if(method == 'OPTIONS')
            {
                res.writeHead(200, headers);
                res.end();
            }
            else
            {
                res.header('Access-Control-Allow-Origin', origin);
                res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.header('Access-Control-Allow-Credentials', true);
                res.header('Access-Control-Allow-Headers', 'Content-Type');
            }
        }

        return next();
    });

    expressApp.use(logger('dev'));
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({extended: true}));
    expressApp.use(expressValidator({
        customValidators: validators
    }));
    expressApp.post('/map/gpx/',multer({ dest: './uploads/',
        rename: function (fieldname, filename) {
            return filename+Date.now();
        },
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting ...')
        },
        onFileUploadComplete: function (file) {
            console.log(file.fieldname + ' uploaded to  ' + file.path)
            done=true;
        },
        onError: function (error, next) {
            console.log(error);
            next(error);
        }
    }));
    expressApp.use(cookieParser());
    expressApp.use('/', express.static(path.join(__dirname, '..', '..', 'public')));
    expressApp.use('/uploads/', express.static(path.join(__dirname, '..', '..', 'uploads')));
    //expressApp.use(express.static(path.join(__dirname, '..', 'public')));
};

exports.init = function (done) {
    return done();
};
