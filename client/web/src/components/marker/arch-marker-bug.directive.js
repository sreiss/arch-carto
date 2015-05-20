'use strict'
angular.module('archCarto')
  .directive('archMarkerBug', function(archMarkerBugService, archTranslateService, $mdToast, $state, $mdSidenav) {
    return {
      restrict: 'E',
      require: ['^archMap', '^archMarker'],
      templateUrl: 'components/marker/arch-marker-bug.html',
      link: function(scope, element, attributes, controllers) {
        var archMap = controllers[0];
        var archMarker = controllers[1];

        archMarker.getCurrentLayer()
          .then(function(layer) {
            if (!layer) {
              $state.go('map.marker.choice');
            } else {
              var coordinates = layer.getLatLng();

              scope.bug = {
                coordinates: coordinates
              };

              scope.save = function(bug) {
                var geoJson = archMarkerBugService.toGeoJson(bug);
                archMarkerBugService.save(geoJson)
                  .then(function (result) {
                    archMap.getBugsLayer()
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
                          .then(function(translation) {
                            $mdToast.show($mdToast.simple().content(translation));
                          });
                      });
                  });
              };

              scope.$watch('bugForm.$valid', function(valid) {
                if (valid) {
                  scope.formValid = true;
                } else {
                  scope.formValid = false;
                }
              }, true);
            }
          });
      }
    }
  });
