var http = require('http');

exports.name = 'arch-server';

exports.attach = function(opts) {
    var app = this;

    var config = app.arch.config;
    var port = config.get('http:port');
    var server = app.arch.server = http.createServer(app.arch.expressApp);

    server.on('error', function (err) {
        if (err.syscall !== 'listen') {
            throw err;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (err.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });
};

exports.init = function(done) {
    return done();
};