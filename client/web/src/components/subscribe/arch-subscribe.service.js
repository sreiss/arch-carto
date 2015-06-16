'use strict'
angular.module('archCarto')
  .factory('archSubscribeService', function(httpConstant, archHttpService, $q) {
    return {
      subscribe: function (oauthUser)
      {
        var deferred = $q.defer();

        oauthUser.signuptype = httpConstant.signupType;

        archHttpService.post(httpConstant.casServerUrl + '/oauth/user', oauthUser).then(function(oauthUser)
        {
          archHttpService.get(httpConstant.cartoServerUrl + '/users/role/MEMBER').then(function(role)
          {
            var cartoUser =
            {
              oauth : oauthUser.data._id,
              role : role.data._id
            };

            archHttpService.post(httpConstant.cartoServerUrl + '/users/user', cartoUser).then(function(cartoUser)
            {
              deferred.resolve(cartoUser);
            })
            .catch(function(err)
            {
              deferred.reject(err);
            })
          })
          .catch(function(err)
          {
            deferred.reject(err);
          })
        })
        .catch(function(err)
        {
          deferred.reject(err);
        });

        return deferred.promise;
      }
    };
  });
