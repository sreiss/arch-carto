'use strict'
angular.module('archCarto')
  .directive('archBackButton', [
    function() {
      return {
        restrict: 'E',
        scope: {
          backState: '@',
          backText: '@'
        },
        templateUrl: 'app/utils/arch-back-button.html',
        controller: function($scope) {
          $scope.backState = $scope.backState || '';
          $scope.backText = $scope.backText || 'BACK';
        }
      }
    }
  ]);
