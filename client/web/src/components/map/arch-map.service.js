'use strict'
angular.module('archCarto')
  .factory('archMapService', function(archPoiService, archMarkerService, archBugService, archLayerService, archGpxService, $q) {
    return {
      init: function() {
        return $q.all([
          archLayerService.addLayer('poi'),
          archLayerService.addLayer('bug'),
          archLayerService.addLayer('pathDrawer'),
          archLayerService.addLayer('selectedCoordinates'),
        ]).then(function (layers) {
          archMarkerService.addMarkerType('poi', {
            icon: {
              type: 'awesomeMarker',
              icon: 'eye',
              markerColor: 'blue'
            }
          });
          archMarkerService.addMarkerType('bug', {
            icon: {
              type: 'awesomeMarker',
              icon: 'exclamation-circle',
              markerColor: 'orange'
            }
          });
          archMarkerService.addMarkerType('pathDrawer', {
            icon: {
              type: 'awesomeMarker',
              markerColor: 'red'
            }
          });
          archMarkerService.addMarkerType('selectedCoordinates', {
            icon: {
              type: 'awesomeMarker',
              markerColor: 'yellow'
            }
          });
          return archLayerService.getLayers()
        });
      },
      refreshMarkers: function() {
        var deferred = $q.defer();
        var currentMarkers = {};

        $q.all([
          archPoiService.getPoiList(),
          archBugService.getBugList(),

        ]).then(function(entitiesArray) {
          var types = ['poi', 'bug', 'selectedCoordinates'];
          for (var i = 0; i < entitiesArray.length; i += 1) {
            archMarkerService.addEntities(types[i], entitiesArray[i])
              .then(function(markers) {
                angular.extend(currentMarkers, markers);
                if (i == entitiesArray.length) {
                  deferred.resolve(currentMarkers);
                }
              });
          }
        });

        return deferred.promise;
      }
      /*getPoiMarkers: function () {
        var deferred = $q.defer();
        archPoiService.getPoiList()
          .then(function(pois) {
            archMarkerService.addEntities('poi', pois)
              .then(function (markers) {
                deferred.resolve(markers);
              });
            /*var poiMarkers = {};

             pois.forEach(function(poi) {
             poiToMarker(poi).then(function(poiMarker) {
             poiMarkers[poi._id] = poiMarker;
             }, function (err) {
             console.log('Error while trying to load one of the pois: ' + err.message);
             });
             });
             deferred.resolve(poiMarkers);

          })
          .catch(function (err) {
            debugger;
          });
        return deferred.promise;
      },*/
    };
  });
