'use strict'
angular.module('archCarto')
  .directive('archSubscribe', function (archSubscribeService, archTranslateService, $mdToast) {
    return {
      restrict: 'E',
      templateUrl: 'components/subscribe/arch-subscribe.html',
      controller: function($scope)
      {
        $scope.subscribe = function()
        {
          archSubscribeService.subscribe($scope.oauthUser).then(function(result)
          {
            $scope.$success = {"subscribeSucceed" : true};
          })
          .catch(function(err)
          {
            console.log(err);
          });
        }
      }
    };
  });
