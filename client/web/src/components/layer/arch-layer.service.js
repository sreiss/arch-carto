'use strict'
angular.module('archCarto')
  .service('archLayerService', function($http, $q, $log, httpConstant) {
    var _layers = {
      overlays: {}
    };

    var toggleLayer = function(layers, action) {
      for (var layerType in _layers) {
        var layersForType = _layers[layerType];
        for (var layerIndex in layers) {
          var layerName = layers[layerIndex];
          var layer = layersForType[layerName];
          if (layer) {
            if (action === 'hide') {
              layer.visible = false;
            } else {
              layer.visible = true;
            }
          }
        }
      }
    };

    return {
      addLayer: function(name, options) {
        var deferred = $q.defer();
        options = options || {};
        var type = options.type || 'overlays';

        if (!_layers[type][name]) {
          _layers[type][name] = {
            type: 'group',
            name: name,
            visible: options.visible || true
          };
          deferred.resolve(_layers[type][name]);
        } else {
          deferred.reject(new Error('Layer already exists'));
        }

        return deferred;
      },
      getLayers: function() {
        return _layers;
      },
      hideLayers: function(layers) {
        toggleLayer(layers, 'hide');
      },
      showLayers: function(layers) {
        toggleLayer(layers);
      }
    }
  });
