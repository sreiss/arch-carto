/**
 * Middleware that will erase the current user at the end of each request.
 */
module.exports = {
    name: 'arch.user.userCleaner',
    attach: function() {
        var app = this;

        app.arch.user = app.arch.user || {};

        var userService = app.arch.user.userService;
        var plugins = app.arch.plugins;

        if (!userService) {
            throw new Error('User cleaner requires userService.');
        }
        if (!plugins) {
            throw new Error('Plugins must be loaded before user cleaner');
        }

        var userCleaner = app.arch.user.userCleaner = function(req, res, next) {
            userService.clean()
                .then(function() {
                    return next();
                })
                .catch(function(err) {
                    next(err);
                });
        };
    },
    init: function(done) {
        return done();
    }
};