'use strict'
angular.module('archCarto')
  .directive('archBackButton', [
    function() {
      return {
        restrict: 'E',
        scope: {
          backState: '='
        },
        templateUrl: 'app/side-nav/arch-back-button.html',
        link: function(scope, element, attributes) {
          scope.backState = scope.backState || 'map';
        }
      }
    }
  ]);
