'use strict'
angular.module('archCarto')
  .directive('archSubscribe', function (archSubscribeService, $mdToast, $mdDialog, $translate, $window) {
    return {
      restrict: 'E',
      templateUrl: 'components/subscribe/arch-subscribe.html',
      controller: function($scope)
      {
        $scope.oauthUser = new OAuthUsers();
        $scope.coreUser = new CoreUsers();

        $scope.addUser = function()
        {
          archUserService.addUser($scope.oauthUser, $scope.coreUser).then(function(result)
          {
            $mdToast.show($mdToast.simple()
                .content("Membre ajouté avec succés.")
                .position('top right')
                .hideDelay(3000)
            );

            //$state.go('users');
          })
            .catch(function(err)
            {
              $mdToast.show($mdToast.simple()
                  .content("Une erreur est survenue lors de l'ajout du membre.")
                  .position('top right')
                  .hideDelay(3000)
              );
            });
        }
      }
    };
  });
