/**
 * User service.
 *
 * @module arch/users
 * @copyright ArchTailors 2015
 */

var Q = require('q');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = function(User, userService, config)
{
    return {
        /** Save user. */
        saveUser: function(userData)
        {
            var deferred = Q.defer();

            // Assign data.
            var user = new User();
            user.oauth = userData.oauth;
            user.role = userData.role;

            user.save(function(err, user)
            {
                if(err)
                {
                    deferred.reject(err.message)
                }
                else
                {
                    userService.sendMail(user);

                    deferred.resolve(user);
                }
            });

            return deferred.promise;
        },

        /** Update user. */
        updateUser: function(userData)
        {
            var deferred = Q.defer();

            User.update({oauth: userData.id},
            {
                role: userData.role
            },
            function(err, numberAffected, rawResponse)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(rawResponse);
                }
            });

            return deferred.promise;
        },

        /** Get user's informations. */
        getUser: function(oauthUserId)
        {
            var deferred = Q.defer();

            User.findOne({oauth: oauthUserId}).populate('role').exec(function(err, result)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(result);
                }
            });

            return deferred.promise;
        },

        getUserByToken: function(token)
        {
            var deferred = Q.defer();

            User.findOne({oauth: token.user._id})
                .populate('role')
                .exec(function(err, result)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(result);
                }
            });

            return deferred.promise;
        },

        /** Get users. */
        deleteUser: function(oauthUserId)
        {
            var deferred = Q.defer();

            User.findOneAndRemove({oauth : oauthUserId}).exec(function(err, result)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(result);
                }
            });

            return deferred.promise;
        },

        /** Send Mail. */
        sendMail: function(oauthUser)
        {
            var transporter = nodemailer.createTransport(smtpTransport(
            {
                host: config.get('mail:smtp'),
                port: config.get('mail:port'),
                auth: {
                    user: config.get('mail:username'),
                    pass: config.get('mail:password')
                },
                tls: {rejectUnauthorized: false},
                debug:true
            }));

            var mailOptions =
            {
                from: config.get('mail:noreply'),
                to: oauthUser.email,
                subject: 'ASCPA - Inscription réussie ✔', // Subject line
                html: '<b>Mot de passe : ' + oauthUser.password + '</b>' // html body
            };

            transporter.sendMail(mailOptions, function(error, info)
            {
                if(error)
                {
                    console.log(error);
                }
                else
                {
                    console.log(info);
                }
            });
        }
    };
};