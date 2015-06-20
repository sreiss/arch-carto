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
              // We convert the marker added by Leaflet Draw to a GeoJSON.
              var coordinates = layer.getLatLng();
              scope.bug = layer.toGeoJSON();

              scope.save = function(bug) {
                archMarkerBugService.save(bug);
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
