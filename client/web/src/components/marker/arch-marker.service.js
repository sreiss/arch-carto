'use strict'
angular.module('archCarto')
  .service('archMarkerService', function($http, $q, $log, httpConstant) {
    var _markers = {};
    var _markerIcons = {};
    var _loadedMarkerIds = {};
    var _areDraggable = {};

    var checkEntity = function(entity) {
      var deferred = $q.defer();

      if (!entity._id) {
        deferred.reject(new Error('An entity must contain an _id property.'));
      }
      else if (!entity.coordinates) {
        deferred.reject(new Error('An entity must have coordinates.'));
      }
      else if (!entity.coordinates.latitude) {
        deferred.reject(new Error('Coordinates must have a latitude.'));
      }
      else if (!entity.coordinates.longitude) {
        deferred.reject(new Error('Coordinates must have a longitude.'));
      }

      deferred.resolve(entity);

      return deferred.promise;
    };

    var createMarker = function(markerType, entity) {
      var deferred = $q.defer();

      checkEntity(entity)
        .then(function(checkedEntity) {
          var message = '';
          if (checkedEntity.name) {
            message += '<h2>' + checkedEntity.name + '</h2>';
          }
          if (checkedEntity.description) {
            message += '<div>' + checkedEntity.description + '</div>';
          }

          var marker = {
            _id: checkedEntity._id,
            layer: markerType,
            lat: checkedEntity.coordinates.latitude,
            lng: checkedEntity.coordinates.longitude
          };

          if (message) {
            marker.message = message;
          }

          if (entity.icon) {
            marker.icon = entity.icon;
          } else if (_markerIcons[markerType]) {
            marker.icon = _markerIcons[markerType];
          }

          // If a marker was loaded, then we cache it's id to not load it again.
          _loadedMarkerIds[markerType].push(checkedEntity._id);

          deferred.resolve(marker);
        })
        .catch(function(err) {
          $log.error(err);
        });

      return deferred.promise;
    };

    var getMarkersForBounds = function(bounds) {

    };

    var addEntity = function(markerType, entity) {
      var deferred = $q.defer();

      createMarker(markerType, entity)
        .then(function(createdMarker) {
          _markers[markerType][markerType + '_' + createdMarker._id] = createdMarker;
          deferred.resolve(createdMarker);
        })
        .catch(function(err) {
          $log.error('An error occured: ' + err.message);
        });

      return deferred.promise;
    };

    return {
      /**
       * Adds a marker type to the available marker types.
       * @param {String} name
       * @returns promise
       */
      addMarkerType: function(name, options) {
        var deferred = $q.defer();

        options = options || {};

        if (!_markers[name]) {
          if (options.icon) {
            _markerIcons[name] = options.icon;
          }
          _markers[name] = {};
          _loadedMarkerIds[name] = [];
          deferred.resolve();
        } else {
          deferred.reject(new Error('The marker type ' + name + ' already exists.'));
        }

        return deferred.promise;
      },
      /**
       * Adds the entities array to the markers.
       * @param {String} markerType
       * @param {Array} entities the entities to extract a marker from. Each one must contain an _id, coordinates, a name and can optionally contain a description.
       * @returns promise
       */
      addEntities: function(markerType, entities) {
        var deferred = $q.defer();

        for (var i = 0; i < entities.length; i += 1) {
          addEntity(markerType, entities[i])
            .then(function(createdMarker) {
              if (i == entities.length) {
                deferred.resolve(_markers[markerType]);
              }
            });
        }

        return deferred.promise;
      },
      addEntity: addEntity,
      getMarkers: function(markerType, bounds) {
        var deferred = $q.defer();

        deferred.resolve(_markers[markerType]);

        return deferred.promise;
      },
      toggleMarkersLock: function(markerType) {
        var deferred = $q.defer();

        if (!angular.isDefined(_markers[markerType])) {
          deferred.reject(new Error("The given marker type " + markerType + " doesn't exist."));
        } else {
          if (angular.isUndefined(_areDraggable[markerType])) {
            _areDraggable[markerType] = false;
          }
          _areDraggable[markerType] = !_areDraggable[markerType];
          for (var markerId in _markers[markerType]) {
            _markers[markerType][markerId].draggable = _areDraggable[markerType];
          }
          deferred.resolve(_areDraggable[markerType]);
        }

        return deferred.promise;
      },
      removeMarkers: function(markerType) {
        var deferred = $q.defer();

        if (!angular.isDefined(_markers[markerType])) {
          deferred.reject(new Error("The given marker type " + markerType + " doesn't exist."));
        } else {
          _markers[markerType] = {};
          deferred.resolve(angular.isDefined(_markers[markerType]));
        }

        return deferred.promise;
      },
      popMarker: function(markerType) {
        var deferred = $q.defer();

        if (!angular.isDefined(_markers[markerType])) {
          deferred.reject(new Error("The given marker type " + markerType + " doesn't exist."));
        } if (_markers[markerType].length == 0) {
          deferred.reject(new Error("The given marker type exists, but no markers where found."));
        } else {
          deferred.resolve(_markers[markerType].pop());
        }

        return deferred.promise;
      }
    }
  });
