'use strict'
angular.module('archCarto')
  .directive('archPoi', function(leafletData, archMapControlService) {
    return {
      restrict: 'E',
      controller: function($scope) {
        console.log('POI');
        archMapControlService.registerControl({
            draw: {
              polyline: false,
              polygon: false,
              circle: false,
              rectangle: false,
              marker: true
            }
          })
          .then(function() {
            leafletData.getMap()
              .then(function(map) {
                var drawnItems = $scope.map.controls.edit.featureGroup;
                map.on('draw:created', function (e) {
                  var layer = e.layer;
                  drawnItems.addLayer(layer);
                  console.log(JSON.stringify(layer.toGeoJSON()));
                });
              });
          });
      }
    };
  });
