'use strict'
angular.module('archCarto')
  .factory('archAccountService', function(archHttpService, $q, httpConstant, $cookieStore, $base64) {
    var casUrl = httpConstant.casServerUrl + '/oauth';

    var _roles = {
      AUTHENTICATED: ['AUTHENTICATED'],
      MEMBER: ['AUTHENTICATED', 'MEMBER'],
      CARTOGRAPHER: ['CARTOGRAPHER'],
      ADMIN: ['AUTHENTICATED', 'MEMBER', 'CARTOGRAPHER', 'ADMIN']
    };

    return {
      saveClient: function()
      {
        var client =
        {
          "name" : httpConstant.clientName,
          "redirect_uri" : httpConstant.clientRedirectUri
        };

        var deferred = $q.defer();

        archHttpService.post(casUrl + '/client', client).then(function(result)
        {
          deferred.resolve(result);
        })
          .catch(function(err)
          {
            deferred.reject(err.message);
          });

        return deferred.promise;
      },

      getCurrentToken: function()
      {
        var token = $cookieStore.get('token');

        if(token)
        {
          var now = new Date();

          if(now.getTime() > token.expired_at)
          {
            $cookieStore.remove('token');
            token = null;
          }
        }

        return token;
      },

      getCurrentUser: function()
      {
        var deferred = $q.defer();
        var token = this.getCurrentToken();

        if(token)
        {
          var currentUser = token.user || null;

          if(currentUser)
          {
            this.getProfile(currentUser._id).then(function(profile)
            {
              currentUser.profile = profile || {};
            })
            .then(function()
            {
              var assets = {};
              currentUser.profile.role = currentUser.profile.role || {};
              currentUser.profile.role.name = currentUser.profile.role.name || '';

              for(var role in _roles)
              {
                assets[role] = _roles[role].indexOf(currentUser.profile.role.name) > -1;
              };

              currentUser.profile.role._is = function(roleName)
              {
                return currentUser.profile.role.assets[roleName] || false;
              };

              currentUser.profile.role.assets = assets;
              deferred.resolve(currentUser);
            })
            .catch(function()
            {
              deferred.resolve(currentUser);
            });
          }
          else
          {
            deferred.reject(new Error('NO_CURRENT_USER_FOUND'));
          }
        }
        else
        {
          deferred.reject(new Error('NO_TOKEN_FOUND'));
        }

        return deferred.promise;
      },

      getProfile: function(id)
      {
        var deferred = $q.defer();

        archHttpService.get(httpConstant.cartoServerUrl + '/users/user/' + id).then(function(result)
        {
          deferred.resolve(result);
        })
        .catch(function(err)
        {
          deferred.reject(err.message);
        });

        return deferred.promise;
      },

      logout: function()
      {
        $cookieStore.remove('token');
        window.location = httpConstant.cartoClientUrl + '/#/';
      },

      getLoginUrl: function()
      {
        var deferred = $q.defer();

        var cookieClientId = $cookieStore.get('CARTO_clientId') || '';
        var cookieClientSecret = $cookieStore.get('CARTO_clientSecret') || '';
        var cookieClientRedirectUri = $cookieStore.get('CARTO_clientRedirectUri') || '';
        var cookieClientHash = $cookieStore.get('CARTO_clientHash') || '';

        // If no saved in cookies, save new client.
        if(cookieClientId.length == 0 || cookieClientSecret.length == 0 || cookieClientRedirectUri.length == 0 || cookieClientHash.length == 0)
        {
          console.log('INIT : Params not found in cookies, save new client.');

          this.saveClient().then(function(result)
          {
            console.log('INIT : Params saved in cookies.');

            var clientHash = $base64.encode(result.data.clientId + ':' + result.data.clientSecret);
            $cookieStore.put('CARTO_clientId', result.data.clientId);
            $cookieStore.put('CARTO_clientSecret', result.data.clientSecret);
            $cookieStore.put('CARTO_clientRedirectUri', result.data.clientRedirectUri);
            $cookieStore.put('CARTO_clientHash', clientHash);

            deferred.resolve(httpConstant.casClientUrl + '/#/?client=' + clientHash + '&return=' + $base64.encode(result.data.clientRedirectUri));
          });
        }
        else
        {
          console.log('INIT : Params found in cookies.');
          deferred.resolve(httpConstant.casClientUrl + '/#/?client=' + cookieClientHash + '&return=' + $base64.encode(cookieClientRedirectUri));
        }

        return deferred.promise;
      }
    };
  });
