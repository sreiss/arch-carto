'use strict'
angular.module('archCarto')
  .directive('archPoi', function(leafletData, archMapControlService, archMapMarkerService) {
    return {
      restrict: 'E',
      require: '^archMap',
      controller: function($scope) {
        archMapControlService.registerControl({
            draw: {
              polyline: false,
              polygon: false,
              circle: false,
              rectangle: false,
              marker: true
            }
          });
      },
      link: function(scope, element, attributes, archMap) {
        leafletData.getMap()
          .then(function(map) {
            var drawnItems = scope.map.controls.edit.featureGroup;
            map.on('draw:created', function (e) {
              var layer = e.layer;
              drawnItems.addLayer(layer);
              archMapMarkerService.addMarker(layer.toGeoJSON(), 'poi')
                .then(function() {
                  archMap.refreshMarkers('poi');
                });
            });
          });
      }
    };
  });
