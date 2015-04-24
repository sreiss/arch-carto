'use strict'
angular.module('archCarto')
  .factory('archMapMarkerService', function() {
    var _markerTypes = {};

    return {
      addMakerType: function(name, editDirective) {
        _markerTypes[name] = editDirective;
        $q.when(_markerTypes[name]);
      }
    }
  });
