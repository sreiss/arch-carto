'use strict'
angular.module('archCarto')
  .factory('archMapLayerService', function($q) {
    var _layers = {};

    return {
      getLayers: function() {
        return $q.when(_layers);
      },
      registerLayer: function(layer, type) {
        if (type) {
          return $q.when(angular.extend(_layers[type], layer));
        }
        return $q.when(angular.extend(_layers, layer));
      },
      registerLayers: function(layers, type) {
        return $q.when(angular.extend(_layers, layers));
      }
    }
  });
