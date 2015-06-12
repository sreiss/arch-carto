'use strict'
angular.module('archCarto')
  .directive('archAccount', function (archAccountService, $translate, $state, $window, httpConstant) {
    return {
      restrict: 'E',
      templateUrl: 'components/account/arch-account.html',
      controller: function($scope, $cookieStore) {
        var init = function()
        {
          // Get login url.
          archAccountService.getLoginUrl().then(function(loginUrl)
          {
            $scope.loginUrl = loginUrl;
          });

          // Check token in cookies.
          var token = archAccountService.getCurrentToken();

          if(!token && $stateParams.token)
          {
            $cookieStore.put('token', JSON.parse(decodeURIComponent(atob($stateParams.token))));
            token = archAccountService.getCurrentToken();
          }

          if(token)
          {
            console.log('INIT : Already connected.');

            archAccountService.getCurrentUser().then(function(user)
            {
              $scope.user = user;
            })
            .then(function()
            {
              if(token.user.signuptype.name != httpConstant.signupType.name && token.user.signuptype.isPublic === false)
              {
                console.log('INIT : Current signup type not public.');

                archAccountService.getLoginUrl().then(function(loginUrl)
                {
                  window.location = loginUrl;
                });
              }
              else
              {
                $scope.alreadyLogged = true;
              }
            })
            .catch(function()
            {
              $mdToast.show($mdToast.simple().content("Une erreur est survenue lors de la récupération de l'utilisateur courant.").position('top right').hideDelay(3000));
            });
          }
        }();

        $scope.myAccount = function()
        {
          archAccountService.getCurrentUser().then(function(user)
          {
            $state.go('userEdit', {'id' : user._id});
          });
        };

        $scope.logout = function()
        {
          archAccountService.logout();
        };
      }
    };
  });
