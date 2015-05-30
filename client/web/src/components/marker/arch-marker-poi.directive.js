'use strict'
angular.module('archCarto')
  .directive('archMarkerPoi', function(archPoiService, archPoiTypeService, archMarkerPoiService, $filter, $state, $translate, archTranslateService, $mdToast, $mdSidenav) {
    return {
      restrict: 'E',
      require: ['^archMap', '^archMarker'],
      templateUrl: 'components/marker/arch-marker-poi.html',
      link: function(scope, element, attributes, controllers) {
        var archMap = controllers[0];
        var archMarker = controllers[1];

        archMarker.getCurrentLayer()
          .then(function(layer) {
            if (!layer) {
              $state.go('map.marker.choice');
            } else {
              var coordinates = layer.getLatLng();

              scope.medias = [];
              scope.formValid = false;
              scope.poi = {
                coordinates: coordinates
              };

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

              scope.save = function(poi) {
                var geoJson = archMarkerPoiService.toGeoJson(poi);
                for(var i = 0; i < scope.medias.length; i += 1) {
                  geoJson.properties.medias.push(scope.medias[i].data._id);
                }
                archMarkerPoiService.save(geoJson)
                  .then(function (result) {
                    debugger;
                    /*
                    archMap.getPoisLayer()
                      .then(function(layer) {
                        return layer.addData(result.value);
                      })
                      .then(function() {
                        return $mdSidenav('right').close();
                      })
                      .then(function() {
                        return archMarker.cleanCurrentLayer();
                      })
                      .then(function() {
                        archTranslateService(result.message)
                          .then(function (translation) {
                            $mdToast.show($mdToast.simple().content(translation));
                          });
                      });
                      */
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
