'use strict'
angular.module('archCarto')
  .directive('archContentDropdown', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        title: '=',
        splitTitle: '@',
        splitFn: '&'
      },
      templateUrl: 'app/utils/arch-content-dropdown.html',
      link: function(scope, element, attributes) {
        var dropIcon = element.find('.drop-icon');
        scope.rotationAngle = 0;
        scope.dropped = false;
        scope.dropdown = function() {
          scope.dropped = !scope.dropped;
          scope.rotationAngle += (180 % 360);
        };
      }
    }
  });
