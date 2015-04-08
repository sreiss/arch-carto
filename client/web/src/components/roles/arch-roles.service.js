'use strict'
angular.module('archCarto')
  .factory('archRolesService', function() {
    var service = {
      userIs: function(roleName) {
        return true;
      }
    };

    return service;
  });
