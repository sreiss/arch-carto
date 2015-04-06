'use strict'
angular.module('archCarto')
  .directive('archPoiAdd', function(archPoiService, $translate, $mdToast) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/poi/arch-poi-add.html',
      link: function(scope, element, attributes, archMap) {
        scope.$watch('mapStatus.selectedCoordinates', function(coordinates) {
          scope.poi = scope.poi || {};
          scope.poi.coordinates = coordinates;
        });

        scope.formValid = false;

        scope.savePoi = function() {
          archPoiService.savePoi(scope.poi)
            .then(function() {
              archMap.refreshMarkers();
              $translate(['POINT_OF_INTEREST_ADDED']).then(function(translations) {
                $mdToast.show($mdToast.simple().content(translations.POINT_OF_INTEREST_ADDED));
              })
              .then(scope.closeRight);
            });
        };
      }
    };
  });
