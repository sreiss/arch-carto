'use strict'
angular.module('archCarto')
  .factory('archFormatService', function() {
    return {
      capitalize: function(string) {
        return string.charAt(0).toUpperCase();
      }
    };
  });
