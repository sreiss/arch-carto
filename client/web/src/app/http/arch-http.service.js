'use strict';
angular.module('archCarto')
  .factory('archHttpService', function($http, $q, $cookieStore, $base64) {
    return {
      get: function(url, config)
      {
        var deferred = $q.defer();
        config = this.setDefaultConfig(config);

        $http.get(url, config).success(function(result)
        {
          deferred.resolve(result);
        })
        .error(function(err)
        {
          deferred.reject(err);
        });

        return deferred.promise;
      },

      post: function(url, data, config)
      {
        var deferred = $q.defer();
        config = this.setDefaultConfig(config);

        $http.post(url, data, config).success(function(result)
        {
          deferred.resolve(result);
        })
        .error(function(err)
        {
          deferred.reject(err);
        });

        return deferred.promise;
      },

      put: function(url, data, config)
      {
        var deferred = $q.defer();
        config = this.setDefaultConfig(config);

        $http.put(url, data, config).success(function(result)
        {
          deferred.resolve(result);
        })
        .error(function(err)
        {
          deferred.reject(err);
        });

        return deferred.promise;
      },

      delete: function(url, config)
      {
        var deferred = $q.defer();
        config = this.setDefaultConfig(config);

        $http.delete(url, config).success(function(result)
        {
          deferred.resolve(result);
        })
        .error(function(err)
        {
          deferred.reject(err);
        });

        return deferred.promise;
      },

      setDefaultConfig: function(config)
      {
        var config = config || {};
        var token = $cookieStore.get('token') || null;

        if(token !== null)
        {
          var accessToken = token.access_token || null;

          config.headers = config.headers || {};
          config.headers["Authorization"] = 'Bearer ' + btoa(JSON.stringify(token));
        }

        return config;
      }
    };
  });
