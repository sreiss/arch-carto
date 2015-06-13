'use strict'
angular.module('archCarto')
  .directive('archSubscribe', function (archSubscribeService, archTranslateService, $mdToast) {
    return {
      restrict: 'E',
      templateUrl: 'components/subscribe/arch-subscribe.html',
      controller: function($scope)
      {
        $scope.subscribeSuccess = false;

        $scope.subscribe = function()
        {
          $scope.subscribeSuccess = true;
          /*archSubscribeService.addUser($scope.oauthUser, $scope.cartoUser).then(function(result)
          {
            $mdToast.show($mdToast.simple().content("Membre ajouté avec succés.").position('top right').hideDelay(3000));
          })
          .catch(function(err)
          {
            $mdToast.show($mdToast.simple().content("Une erreur est survenue lors de l'ajout du membre.").position('top right').hideDelay(3000)
            );
          });*/
        }
      }
    };
  });
