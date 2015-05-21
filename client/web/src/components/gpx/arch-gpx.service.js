'use strict'
angular.module('archCarto')
  .factory('archGpxService', function($http, httpConstant, $q,archHttpService) {
    var _gpxUrl = httpConstant.cartoServerUrl + '/map/gpx';

    return {
      getTrace: function(params) {
          return archHttpService.get(_gpxUrl, {params: params});
      }
    };
  });
