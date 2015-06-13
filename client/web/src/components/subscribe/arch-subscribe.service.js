'use strict'
angular.module('archCarto')
  .factory('archSubscribeService', function(httpConstant, $q) {
    var casUrl = httpConstant.casServerUrl + '/';

    return {
      saveUser: function (oauthUser, cartoUser)
      {
        var deferred = $q.defer();

        archHttpService.post(casUrl, oauthUser).then(function(result)
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
