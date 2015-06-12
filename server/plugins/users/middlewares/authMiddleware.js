var passport = require('passport'),
    BearerStrategy = require('passport-http-bearer');

module.exports = function(User)
{
    passport.use(new BearerStrategy(function (token, next)
    {
        User.findOne({token: token}, function (err, user)
        {
            if (err)
            {
                return next(err);
            }
            else if(!user)
            {
                return next(null, false);
            }
            else
            {
                return next(null, user, {scope: 'read'});
            }
        });
    }));

    return {
        authenticate: passport.authenticate('bearer', {session: false})
    };
};