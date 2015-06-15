'use strict';
angular.module('archCarto')
  .directive('archMemberSpaceRatedCourses', function(archRatingService, archAccountService) {
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

        archAccountService.getCurrentUser()
          .then(function(user) {
            return archRatingService.getList({
              userId: user._id
            })
          })
          .then(function(result) {
            scope.ratings = result.value;
          });
      }
    }
  });
