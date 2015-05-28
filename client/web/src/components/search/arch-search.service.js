'use strict'
angular.module('archCarto')
  .factory('archSearchService', function($http, httpConstant, $q,archHttpService) {
    var _searchUrl = httpConstant.cartoServerUrl + '/map/search';

    return {
      postSearch: function(filter) {
        var deferred = $q.defer();
        $http.post(_searchUrl, filter)
          .success(function(data,status,headers, config){
            deferred.resolve(data);
          })
          .error(function(data, status, headers, config) {
            deferred.reject(data);
          });
        return deferred.promise;
      }
    };
  });
