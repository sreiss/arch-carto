'use strict'
angular.module('archCarto')
  .service('archMediaService', function(Upload) {
    return {
      upload: function(url, file) {
        return Upload.upload({
            url: url,
            fields: file.metas,
            file: file.data,
            method: 'POST'
          }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
          });
      }
    };
  });
