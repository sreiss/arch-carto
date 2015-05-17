'use strict'
angular.module('archCarto')
  .factory('archGpxUploadService', function (archHttpService, $q, httpConstant) {
    var _gpxUrl = httpConstant.apiUrl + '/map/gpx';

    return{
      uploadFileToUrl: function(file){
        //var fd = new FormData();
        //fd.append('file', file);
        //archHttpService.post(_gpxUrl, fd, {
        //  transformRequest: angular.identity,
        //  headers: {'Content-Type': "multipart/form-data"}
        //})

          //.success(function(){
          //  console.log("Ca marche");
          //})
          //.error(function(){
          //  console.log('Error upload');
          //});
          //var gpx = file[0];
          //var formData = new FormData();
          formData.append("file", gpx);
          return archHttpService.post(_gpxUrl, file, {
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
          });
      }
    }
  });
