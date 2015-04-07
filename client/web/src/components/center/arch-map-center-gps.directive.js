'use strict'
angular.module('archCarto')
  .directive('archMapCenterGps', function() {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/center/arch-map-center-gps.html',
      link: function(scope, element, attributes, archMap) {
        scope.chooseCenter = function(center) {
          archMap.setCenter(center);
          scope.closeRight();
        };
      }
    }
  });
