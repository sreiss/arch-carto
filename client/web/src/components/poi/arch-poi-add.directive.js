'use strict'
angular.module('archCarto')
  .directive('archPoiAdd', function() {
    return {
      restrict: 'E',
      templateUrl: 'components/poi/arch-poi-add.html',
      link: function(scope, element, attributes) {
        scope.$watch('mapStatus.selectedCoordinates', function(coordinates) {
          scope.poi = scope.poi || {};
          scope.poi.coordinates = coordinates;
        });

        scope.formValid = false;
      }
    };
  });
