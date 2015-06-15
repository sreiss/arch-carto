'use strict'
angular.module('archCarto')
  .factory('archSubscribeService', function(httpConstant, archHttpService, $q) {
    var casUrl = httpConstant.casServerUrl + '/oauth';

    return {
      subscribe: function (oauthUser)
      {
        var deferred = $q.defer();

        oauthUser.signuptype = httpConstant.signupType;

        archHttpService.post(casUrl + '/user', oauthUser).then(function(result)
        {
          deferred.resolve(result);
        })
        .catch(function(err)
        {
          deferred.reject(err);
        })

        return deferred.promise;
      }
    };
  });
