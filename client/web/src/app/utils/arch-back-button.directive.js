'use strict'
angular.module('archCarto')
  .directive('archBackButton', function($document) {
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

        $scope.clearBackdrop = function() {
          $document.find('body').find('.md-sidenav-backdrop').remove();
        }
      }
    }
  });
