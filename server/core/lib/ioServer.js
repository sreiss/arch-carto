var io = require('socket.io');

exports.name = 'arch-ioServer';

exports.attach = function(opts) {
    var app = this;

    var config = app.arch.config;

    var ioServer = app.arch.ioServer = io(app.arch.server);
    ioServer.on('connection', function(socket) {
       console.log((new Date()) + ' client connected');
    });
};

exports.init = function(done) {
    return done();
};