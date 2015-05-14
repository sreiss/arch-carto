var fs = require('fs'),
    path = require('path'),
    Q = require('q');

module.exports = {
    name: 'arch.loaders.errorsLoader',
    attach: function (opts) {
        var app = this;

        var errorsDir = path.join(__dirname, '..', 'errors');
        try {
            var foundErrorFiles = fs.readdirSync(errorsDir);

            foundErrorFiles.forEach(function (foundErrorFile) {
                var errorName = path.basename(foundErrorFile, '.js');
                var errorObj = require(path.join(errorsDir, errorName));
                if (!(errorObj instanceof  Object)) {
                    throw new TypeError('An error must be an Object.');
                }
                GLOBAL[errorName] = errorObj;
            });
        } catch (e) {
            console.warn('No lib/errors directory found.');
        }
    },
    init: function(done) {
        return done();
    }
};
