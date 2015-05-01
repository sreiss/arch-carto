'use strict'
angular.module('archCarto')
  .directive('archPath', function(leafletData, $log) {
    return {
      restrict: 'E',
      require: '^archMap',
      link: function(scope, element, attributes, archMap) {

        var _currentLayer = {};

        archMap.hasFeatureGroup('edit')
          .then(function(hasFeatureGroup) {
            if (hasFeatureGroup) {
              return archMap.getFeatureGroup('edit');
            } else {
              return archMap.addFeatureGroup('edit', {});
            }
          })
          .then(function(featureGroup) {
            archMap.addControl('draw', L.Control.Draw, {
              draw: {
                polygon: false,
                marker: false,
                rectangle: false,
                circle: false
              },
              edit: {
                featureGroup: featureGroup
              }
            });
          })
          .catch(function(err) {
            $log.error(err);
          });

        leafletData.getMap()
          .then(function(map) {
            map.on('draw:created', function (e) {
              var type = e.layerType;
              var layer = e.layer;

              if (type == 'polyline') {
                alert('ok');
              }

              map.addLayer(layer);
            });
          });

        // Suppression des controls de draw lors du changement d'action.
        scope.$on('$destroy', function() {
          archMap.removeControl('draw')
            .catch(function(err) {
              $log.error(err);
            });
        });
      }
    }
  });
