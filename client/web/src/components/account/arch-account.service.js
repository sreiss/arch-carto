'use strict'
angular.module('archCarto')
  .factory('archAccountService', function(archHttpService, $q, httpConstant, $cookieStore, $base64, $translate, $mdDialog) {
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

        archHttpService.post(httpConstant.casServerUrl + '/oauth/client', client).then(function(result)
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
        var self = this;
        var deferred = $q.defer();
        var token = this.getCurrentToken();

        if(token)
        {
          var currentUser = token.user || null;

          if(currentUser)
          {
            self.getProfile(currentUser._id).then(function(result)
            {
              if(result.count > 0)
              {
                return result;
              }
              else
              {
                return $q.reject(new Error('CARTO_PROFILE_NOT_FOUND'));
              }
            })
            .catch(function()
            {
              return self.getCoreProfile(currentUser._id).then(function(coreProfile)
              {
                var cartoProfile =
                {
                  oauth : coreProfile.data.oauth,
                  role : coreProfile.data.role._id
                };

                return archHttpService.post(httpConstant.cartoServerUrl + '/users/user', cartoProfile).then(function(cartoProfile)
                {
                  return coreProfile;
                });
              })
            })
            .then(function(profile)
            {
              var assets = {};
              currentUser.profile = profile.data;
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
          deferred.reject(err);
        });

        return deferred.promise;
      },

      getCoreProfile: function(id)
      {
        var deferred = $q.defer();

        archHttpService.get(httpConstant.coreServerUrl + '/users/user/' + id).then(function(result)
        {
          deferred.resolve(result);
        })
        .catch(function(err)
        {
          deferred.reject(err);
        });

        return deferred.promise;
      },

      logout: function()
      {
        $cookieStore.remove('token');

        this.getLoginUrl().then(function(loginUrl)
        {
          window.location.href = loginUrl + '&logout=true';
        });
      },

      getLoginUrl: function()
      {
        var deferred = $q.defer();
        var cookieClientHash = $cookieStore.get('CARTO_clientHash') || '';

        // If no saved in cookies, save new client.
        if(cookieClientHash.length == 0)
        {
          console.log('INIT : Params not found in cookies, save new client.');

          this.saveClient().then(function(result)
          {
            console.log('INIT : Params saved in cookies.');

            var clientHash = $base64.encode(result.data.clientId + ':' + result.data.clientSecret);
            $cookieStore.put('CARTO_clientHash', clientHash);

            deferred.resolve(httpConstant.casClientUrl + '/#/?client=' + clientHash + '&return=' + $base64.encode(httpConstant.clientRedirectUri));
          });
        }
        else
        {
          console.log('INIT : Params found in cookies.');
          deferred.resolve(httpConstant.casClientUrl + '/#/?client=' + cookieClientHash + '&return=' + $base64.encode(httpConstant.clientRedirectUri));
        }

        return deferred.promise;
      },

      updateToken: function(profile)
      {
        var token = this.getCurrentToken();

        token.user.lname = profile.user.lname;
        token.user.fname = profile.user.fname;
        $cookieStore.put('token', token);
      },

      showRestrictionModal: function() {
        return $translate([
          'ERROR',
          'YOU_HAVE_TO_BE_LOGGED_IN_TO_ACCESS_THIS_AREA',
          'OK'
        ]).then(function(translations) {
          return $mdDialog.show(
            $mdDialog.alert()
              .title(translations.ERROR)
              .content(translations.YOU_HAVE_TO_BE_LOGGED_IN_TO_ACCESS_THIS_AREA)
              .ok(translations.OK)
          );
        });
      }
    };
  });
