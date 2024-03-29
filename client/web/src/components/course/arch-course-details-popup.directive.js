'use strict';
angular.module('archCarto')
  .directive('archCourseDetailsPopup', function(archCourseService, $log) {
    return {
      restrict: 'E',
      templateUrl: 'components/course/arch-course-details-popup.html',
      controller: function($scope) {
        $scope.course = false;
        if ($scope.id) {
          archCourseService.get($scope.id)
            .then(function(result) {
              $scope.course = result.value;
              var blob = new Blob([ togpx(result.value) ], { type : 'text/plain' });
              $scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
            })
            .catch(function(err) {
              $log.error(err);
            });
        } else {
          $scope.course = null;
        }
      }
    };
  });
