var Q = require('q'),
    ArchError = GLOBAL.ArchError;

module.exports = {
    name: 'arch.user.userService',
    attach: function() {
        var app = this;

        app.arch.user = app.arch.user || {};
        app.arch.user.userService = (function() {
            _currentUser = null;
            return {
                getUser: function() {
                    if (_currentUser === null) {
                        Q.reject(new ArchError('NO_CURRENT_USER'));
                    } else {
                        Q.resolve(_currentUser);
                    }
                },
                setUser: function(user) {
                    _currentUser = user;
                }
            }
        })();
    },
    init: function(done) {
        return done();
    }
};