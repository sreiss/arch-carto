'use strict'
angular.module('archCarto')
  .directive('archMapSideNavPathLeft', function(leafletData) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/path/arch-map-side-nav-path-left.html',
      link: function(scope, element, attributes, archMap) {

        /*archMap.getMap()
          .then(function(map) {
            // Initialise the FeatureGroup to store editable layers
            var drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);

            // Initialise the draw control and pass it the FeatureGroup of editable layers
            var drawControl = new L.Control.Draw({
              draw: {
                position: 'topleft',
                polygon: {
                  title: 'Draw a sexy polygon!',
                  allowIntersection: false,
                  drawError: {
                    color: '#b00b00',
                    timeout: 1000
                  },
                  shapeOptions: {
                    color: '#bada55'
                  },
                  showArea: true
                },
                polyline: {
                  metric: false
                },
                circle: {
                  shapeOptions: {
                    color: '#662d91'
                  }
                }
              },
              edit: {
                featureGroup: drawnItems
              }
            });
            map.addControl(drawControl);

            scope.removePathControl = function() {
              map.removeControl(drawControl);
            };

            map.on('draw:created', function(e) {
              var type = e.layerType,
                layer = e.layer;

              if (type === 'marker') {
                layer.bindPopup('A popup!');
              }

              drawnItems.addLayer(layer);
            });
          });*/
      }
    }
  });
