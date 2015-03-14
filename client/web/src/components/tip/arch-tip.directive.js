'use strict'
angular.module('archCarto')
  .directive('archTip', function($timeout, $animate) {
    return {
      restrict: 'E',
      scope: {
        message: '@',
        duration: '=?'
      },
      templateUrl: 'components/tip/arch-tip.html',
      link: function(scope, element, attributes) {
        element.addClass('arch-tip');
        scope.duration = scope.duration || 4000;
        $timeout(function() {
          $animate.leave(element);
        }, scope.duration)
      }
    }
  });
