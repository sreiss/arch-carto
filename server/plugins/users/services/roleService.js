var Q = require('q'),
    _ = require('underscore'),
    ArchError = GLOBAL.ArchError;

module.exports = function(Role) {
    var _hierarchy = {
        AUTHENTICATED: ['AUTHENTICATED'],
        MEMBER: ['AUTHENTICATED', 'MEMBER'],
        ADMIN: ['AUTHENTICATED', 'MEMBER', 'CARTOGRAPHER', 'ADMIN'],
        CARTOGRAPHER: ['AUTHENTICATED', 'MEMBER', 'ADMIN']
    };

    return {
        is: function(user, roleName) {
            if (!_hierarchy[user.role.name]) {
                throw new ArchError('UNKNOWN_ROLE', 500);
            }
            return _.contains(_hierarchy[user.role.name], roleName);
        },

        getList: function() {
            var deferred = Q.defer();
            Role.find({}, function(err, roles) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(roles);
                }
            });
            return deferred.promise;
        },

        getRole: function(roleName)
        {
            var deferred = Q.defer();

            Role.findOne({name: roleName}).exec(function(err, result)
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
        }
    };
};