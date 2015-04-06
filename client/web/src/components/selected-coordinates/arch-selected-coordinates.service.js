'use strict'
angular.module('archCarto')
  .factory('archSelectedCoordinatesService', function($q) {
    var _selectedCoordinates = {
      latitude: null,
      longitude: null
    };
    return {
      setSelectedCoordinates: function(coordinates) {
        var deferred = $q.defer();

        if (!coordinates.latitude) {
          deferred.reject(new Error('Coordinates must have a latitude.'));
        } else if (!coordinates.longitude) {
          deferred.reject(new Error('Coordinates must have a longitude.'));
        } else {
          _selectedCoordinates = coordinates;
          deferred.resolve(coordinates);
        }

        return deferred.promise;
      },
      getSelectedCoordinates: function() {
        var deferred = $q.defer();

        if (_selectedCoordinates.latitude == null || _selectedCoordinates.longitude == null) {
          deferred.reject(new Error('Selected coordinates where not set.'));
        } else {
          deferred.resolve(_selectedCoordinates);
        }

        return deferred.promise;
      }
    };
  });
