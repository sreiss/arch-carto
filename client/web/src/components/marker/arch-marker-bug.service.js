'use strict';
angular.module('archCarto')
  .factory('archMarkerBugService', function(archSocketService, httpConstant, archHttpService, $q) {
    archSocketService.openSocket('bug', '/map/bug');
    var _bugUrl = httpConstant.cartoServerUrl + '/map/bug';

    var service = {
      toGeoJson: function(bug) {
        return {
          properties: {
            description: bug.description,
            altitude: 0
          },
          geometry: {
            coordinates: [bug.coordinates.lng, bug.coordinates.lat]
          }
        }
      },
      save: function(bug) {
        return archHttpService.post(_bugUrl, bug);
      },
      getList: function() {
        return archHttpService.get(_bugUrl);
      },
      get : function(id) {
        return archHttpService.get(_bugUrl + '/' + id);
      }
    };

    return archSocketService.initService('bug', service);
  });
