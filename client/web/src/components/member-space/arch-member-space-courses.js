'use strict';
angular.module('archCarto')
  .directive('archMemberSpaceCourses', function() {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/member-space/arch-member-space-courses.html',
      link: function(scope, element, attributes, archMap) {
        archMap.setDisplayOptions({
          mapRight: {
            width: 'extra'
          }
        });
      }
    }
  });
