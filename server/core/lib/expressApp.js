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

    var customValidators = {};
    try {
        var validatorFiles = fs.readdirSync(path.join(__dirname, 'validators'));
        validatorFiles.forEach(function (validatorFile) {
            var requireName = path.join(__dirname, 'validators', path.basename(validatorFile, '.js'));
            var validator = require(requireName);
            utils.extend(customValidators, validator);
        });
    } catch(err) {
        if (err.code == 'ENOENT') {
            console.log('No custom validators added.');
        } else {
            throw err;
        }
    }

    //expressApp.set('views', path.join(__dirname, '..', 'views'));
    //expressApp.set('view engine', 'jade');
    expressApp.use(logger('dev'));
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({extended: false}));
    expressApp.use(expressValidator({
        customValidators: customValidators
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
