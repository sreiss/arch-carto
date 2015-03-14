'use strict'
angular.module('archCarto')
  .service('archPathService', function(archMarkerService, $q) {
    var _pathDrawer = {
      enabled: false,
      currentPath: {
        color: 'red',
        weight: 4,
        latlngs: [

        ]
      },
      points: {

      }
    };

    var _pog = {
      type: 'pog',
      icon: {
        type: 'awesomeMarker',
        icon: 'arrows-alt',
        markerColor: 'red'
      }
    };

    var _pop = {
      type: 'pop',
      icon: {
        type: 'awesomeMarker',
        icon: 'arrows-h',
        markerColor: 'green'
      }
    };

    return {
      getPathDrawer: function() {
        return _pathDrawer;
      },
      addPoint: function(coordinates) {
        var deferred = $q.defer();
        var index = Object.keys(_pathDrawer.points).length;

        _pathDrawer.currentPath.latlngs.push({
          lat: coordinates.latitude,
          lng: coordinates.longitude
        });

        var id = 'pathDrawer_' + index;
        var entity = {
          _id: id,
          coordinates: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
          }
        };

        if (index === 0) {
          angular.extend(entity, _pog);
        } else {
          angular.extend(entity, _pop);
        }

        archMarkerService.addEntity('pathDrawer', entity)
          .then(function(marker) {
            _pathDrawer.points[marker._id] = marker;
            deferred.resolve(marker);
          });

        return deferred.promise;
      },
      pathDrawn: function() {
        return _pathDrawer.currentPath.latlngs.length > 0;
      },
      deletePath: function() {
        var deferred = $q.defer();
        _pathDrawer.currentPath.latlngs = [];
        var markerIds = Object.keys(_pathDrawer.points);
        _pathDrawer.points = {};
        deferred.resolve(markerIds);
        return deferred.promise;
      }
    }
  });
