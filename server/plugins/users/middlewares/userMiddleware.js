/**
 * User plugin.
 *
 * @module arch/users
 * @copyright ArchTailors 2015
 */

var validator = require('validator');
var ArchParameterError = GLOBAL.ArchParameterError;

module.exports = function() {
    return {
        checkUpdateUser: function(req, res, next)
        {
            // Get user data.
            var userData = req.body.user;

            // Check user first name (length >= 3).
            var userFirstName = userData.fname || '';
            if(!validator.isLength(userFirstName, 3))
            {
                throw new ArchParameterError("User first name must contain at least 3 chars.")
            }

            // Check user first name (length >= 3).
            var userLastName = userData.lname || '';
            if(!validator.isLength(userLastName, 3))
            {
                throw new ArchParameterError("User last name must contain at least 3 chars.")
            }

            // Check user password.
            var userPassword = userData.password || '';
            if(!validator.isLength(userPassword, 5))
            {
                throw new ArchParameterError("User password must contain at least 5 chars.")
            }

            // Check user signuptype.
            var userSignupTypeName = userData.signuptype || {};
            if(!validator.isLength(userSignupTypeName, 3))
            {
                throw new ArchParameterError("User signup type must contain at least 3 chars.")
            }

            next();
        },

        checkOauthUserId: function(req, res, next)
        {
            // Check user id.
            var oauthUserId = req.params.oauthUserId || '';
            if(!validator.isMongoId(oauthUserId))
            {
                throw new ArchParameterError("OAuth User ID isn't a valid MongoId.");
            }

            next();
        }
    };
};
