'use strict';
angular.module('archCarto')
  .directive('archMemberSpaceRatedCourses', function(archRatingService) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/member-space/arch-member-space-rated-courses.html',
      link: function(scope, element, attributes, archMap) {
        archMap.setDisplayOptions({
          mapRight: {
            width: 'extra'
          }
        });

        archRatingService.getList({
            userId: scope.currentUserId
          })
          .then(function(result) {
            scope.ratings = result.value;
          });
      }
    }
  });
