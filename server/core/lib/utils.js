exports.name = 'arch-utils';

exports.attach = function(opts) {
    var app = this;

    var utils = app.arch.utils = {};

    utils.normalizePort = function(val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    };

    utils.capitalize = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    utils.extend = function(dest, src) {
        var srcKeys = Object.keys(src);
        for (var srcKey in srcKeys) {
            dest[srcKeys[srcKey]] = src[srcKeys[srcKey]];
        }
    };

    utils.slugify = function(str) {
        return str.replace(/[A-Z]/g, function (s) {
            return '-' + s.toLowerCase();
        });
    };

    utils.camelify = function(str) {
        return str.replace(/[\-][a-z1-2]/g, function(s) {
            return s[s.lastIndex].toUpperCase();
        });
    };

};

exports.init = function(done) {
    return done();
};