var passport = require('passport'),
    BearerStrategy = require('passport-http-bearer'),
    atob = require('atob');

module.exports = function(userService)
{
    passport.use(new BearerStrategy(function (token, next)
    {
        var token = JSON.parse(atob(token));

        userService.getUserByToken(token).then(function(user)
        {
            if(!user)
            {
                return next(null, false);
            }
            else
            {
                return next(null, user, {scope: 'read'});
            }
        })
        .catch(function(err)
        {
            return next(err);
        });
    }));

    return {
        authenticate: passport.authenticate('bearer', {session: false})
    };
};