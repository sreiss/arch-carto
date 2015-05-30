var passport = require('passport'),
    BearerStrategy = require('passport-http-bearer');

module.exports = function() {
    /**
     * @module Oauth2.0 middleware to get the current user from the given token.
     */
    passport.use(new BearerStrategy(
        function (token, next) {
            User.findOne({token: token}, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next(null, false);
                }
                return next(null, user, {scope: 'read'});
            });
        }
    ));

    return {
        authenticate: passport.authenticate('bearer', {session: false})
    };
};