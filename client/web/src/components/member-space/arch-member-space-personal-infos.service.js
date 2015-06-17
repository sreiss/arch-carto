'use strict'
angular.module('archCarto')
  .factory('archMemberSpacePersonalInfosService', function(archHttpService, $q, httpConstant, archAccountService) {
    return {
      getPersonalInfos: function()
      {
        var deferred = $q.defer();

        var profile = {user : {}};

        archAccountService.getCurrentUser().then(function(user)
        {
          profile.user.id = user._id;
          profile.user.lname = user.lname;
          profile.user.fname = user.fname;
          profile.user.email = user.email;
          profile.user.password = user.password;
          profile.user.newPassword = '';
          profile.user.confirmNewPassword = '';

          deferred.resolve(profile);
        })
        .catch(function(err)
        {
          deferred.reject(err);
        });

        return deferred.promise;
      },

      updatePersonalInfos: function(profile)
      {
        var deferred = $q.defer();

        archHttpService.put(httpConstant.casServerUrl + '/oauth/user', profile).then(function(result)
        {
          deferred.resolve(result);
        })
        .catch(function(err)
        {
          deferred.reject(err);
        });

        return deferred.promise;
      }
    };
  });
