'use strict';
angular.module('archCarto')
  .directive('archCourse', function() {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/course/arch-course.html',
      controller: function($scope) {

      }
    }
  });
