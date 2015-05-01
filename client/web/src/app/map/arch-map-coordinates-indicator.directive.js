'use strict';
angular.module('archCarto')
  .directive('archMapCoordinatesIndicator', function($log) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'app/map/arch-map-coordinates-indicator.html',
      link: function(scope, element, attributes, archMap) {

        archMap.getCenter()
          .then(function(center) {
            scope.cursor = {
              lat: center.lat,
              lng: center.lng
            };

            scope.$on('leafletDirectiveMap.mousemove', function(event, args) {
              var leafletEvent = args.leafletEvent;
              var latlng = leafletEvent.latlng;
              scope.cursor.lat = latlng.lat;
              scope.cursor.lng = latlng.lng;
            });
          })
          .catch(function(err) {
            $log.error(err);
          });
      }
    }
  });
