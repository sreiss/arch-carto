'use strict'
angular.module('archCarto')
  .factory('archMarkerBugService', function(archSocketService, httpConstant, archHttpService, $q) {
    var _socket = archSocketService.openSocket('/map/bug');
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
      /* socket */
      save: function(bug) {
        _socket.emit('save', bug);
      },
      messages: function(callback) {
        _socket.on('save', callback);
      },
      error: function(callback) {
        _socket.on('error', callback);
      },
      refresher: function(callback) {
        _socket.on('newBug', callback);
      },
      /* http */
      //save: function(bug) {
      //  return archHttpService.post(_bugUrl, bug);
      //},
      getList: function() {
        return archHttpService.get(_bugUrl);
      },
      get : function(id) {
        return archHttpService.get(_bugUrl + '/' + id);
      }
    }
  });
