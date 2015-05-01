'use strict'
angular.module('archCarto')
  .directive('archMarkerPoi', function(archPoiService, archPoiTypeService, $filter, $state) {
    return {
      restrict: 'E',
      require: '^archMarker',
      templateUrl: 'components/marker/arch-marker-poi.html',
      link: function(scope, element, attributes, archMarker) {
        archMarker.getCurrentLayer()
          .then(function(layer) {
            if (!layer) {
              $state.go('map.marker.choice');
            } else {
              var coordinates = layer.getLatLng();

              scope.formValid = false;
              scope.poi = {};

              scope.poiTypes = [];

              archPoiTypeService.getPoiTypeList(function(result) {
                scope.poi.type = scope.poi.type || result[0];
                scope.poiTypes = result;
              });

              scope.addPoiType = function(poiTypeName) {
                var poiType = {
                  name: poiTypeName
                };
                archPoiTypeService.savePoiType(poiType, function(result) {
                  scope.poi.type = result;
                  if (($filter('filter')(scope.poiTypes, result.name, 'strict')).length == 0) {
                    scope.poiTypes.push(result);
                  }
                  scope.newPoiTypeName = '';
                });
              };

              scope.$watch('poiForm.$valid', function(valid) {
                if (valid) {
                  scope.formValid = true;
                } else {
                  scope.formValid = false;
                }
              }, true);
            }
          });
      }
    };
  });
