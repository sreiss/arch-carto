'use strict'
angular.module('archCarto')
  .factory('archGpxUploadService', function (archHttpService, $q, httpConstant) {
    var _gpxUrl = httpConstant.cartoServerUrl + '/map/gpx';

    return{
      uploadFileToUrl: function(trace){
        var deferred = $q.defer();

        deferred.resolve(archHttpService.post(_gpxUrl, trace));
        return deferred.promise;
      }
    }
  });
