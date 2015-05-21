'use strict'
angular.module('archCarto')
  .factory('archMarkerBugService', function(httpConstant, archHttpService) {
    var _bugUrl = httpConstant.cartoServerUrl + '/map/bug';

    return {
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
    }
  });
