'use strict';
angular.module('archCarto')
  .factory('archMarkerBugService', function(archSocketService, archCrudService, httpConstant, archHttpService, $q) {
    archSocketService.openSocket('bug', '/map/bug');
    var _bugUrl = httpConstant.cartoServerUrl + '/map/bug';

    var service = archSocketService.initService('bug', {});
    return archCrudService.initService('bug', service, _bugUrl);
  });
