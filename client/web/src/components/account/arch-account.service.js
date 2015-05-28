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

    var _is = function(roleName) {
      var currentUser = this.getCurrentUser();
      var role;
      if (currentUser && currentUser.profil && (role = currentUser.profil.role)) {
        return _roles[roleName].indexOf(role.name) > -1;
      } else {
        return false;
      }
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
        var token = this.getCurrentToken();
        var currentUser;
        if (token) {
          currentUser = token.user || null;
        } else {
          currentUser = null;
        }

        return currentUser;
      },

      isCartographer: function() {
        return _is('CARTOGRAPHER');
      },

      isAuthenticated: function() {
        return _is('AUTHENTICATED');
      },

      isMember: function() {
        return _is('MEMBER');
      },

      isAdmin: function() {
        return _is('ADMIN');
      },

      isCurrentUserAdmin: function()
      {
        var currentUser = this.getCurrentUser();
        var role = currentUser.profil.role || '';

        if(role == "admin")
        {
          return true;
        }

        return false;
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
        window.location.reload();
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
