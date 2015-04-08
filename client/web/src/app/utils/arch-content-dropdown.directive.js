'use strict'
angular.module('archCarto')
  .directive('archContentDropdown', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        title: '=',
        splitTitle: '@',
        splitFn: '&',
        showSplit: '='
      },
      templateUrl: 'app/utils/arch-content-dropdown.html',
      link: function(scope, element, attributes) {
        var dropIcon = element.find('.arch-drop-icon');
        scope.showSplit = true;
        scope.rotationAngle = 0;
        scope.dropped = false;
        scope.dropdown = function() {
          scope.dropped = !scope.dropped;
          scope.rotationAngle += (180 % 360);
        };
      }
    }
  });
