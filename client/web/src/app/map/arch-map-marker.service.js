'use strict'
angular.module('archCarto')
  .factory('archMapMarkerService', function(archHttpService, $q) {
    var _markers = {};

    var generateMarkerId = function(type) {
      return type + '_' + Object.keys(_markers[type]).length;
    };

    return {
      addMarkers: function(markers, type) {
        var deferred = $q.defer();
        if (!Array.isArray(markers)) {
          deferred.reject(new Error('Expected array, ' + (typeof markers) + ' given.'));
        } else {
          markers.forEach(function(marker) {
            this.addMarker(marker, type);
          });
          deferred.resolve();
        }
        return deferred.promise;
      },
      addMarker: function(marker, type) {
        var deferred = $q.defer();
        if (!type) {
          deferred.reject(new Error('A marker must have a type.'));
        }
        if (!_markers[type]) {
          _markers[type] = [];
        }
        _markers[type].push(marker);
        deferred.resolve();
        return deferred.promise;
      },
      getMarkers: function(type) {
        if (type) {
          return $q.when(angular.toJson({
            type: 'FeatureCollection',
            features: _markers[type]
          }));
        }
        return $q.when(_markers);
      }
    }
  });
