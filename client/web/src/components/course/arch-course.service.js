'use strict';
angular.module('archCarto')
  .factory('archCourseService', function(archHttpService, archSocketService, httpConstant) {
    archSocketService.openSocket('course', '/map/course');
    var _courseUrl = httpConstant.cartoServerUrl + '/map/course';

    var service = {
      getTemplate: function() {
        return angular.copy({
          properties: {
            description: '',
            difficulty: '',
            length: '',
            public: false
          },
          geometry: {
            coordinates: []
          }
        });
      },
      getList: function() {
        return archHttpService.get(_courseUrl);
      },
      get: function(id) {
        return archHttpService.get(_courseUrl + '/' + id);
      },
      save: function(course) {
        return archHttpService.post(_courseUrl, course);
      }
    };

    return archSocketService.initService('course', service);
  });
