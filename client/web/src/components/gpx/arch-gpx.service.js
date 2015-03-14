'use strict'
angular.module('archCarto')
  .factory('archGpxService', function($http, httpConstant, $q, FileUploader,archHttpService) {
    var _gpxUrl = httpConstant.apiUrl + '/map/gpx';

    return {
      getGpxUploader: function() {
        //var deferred = $q.defer();
        //var fileUploader = new FileUploader({
        //  url: _gpxUrl,
        //  queueLimit: 1
        //});
        //console.log(_gpxUrl);
        //deferred.resolve(fileUploader);
        return archHttpService.get(_gpxUrl);
        //return deferred.promise;
      }
    };
  });
