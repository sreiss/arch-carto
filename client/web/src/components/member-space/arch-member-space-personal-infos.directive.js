'use strict';
angular.module('archCarto')
  .directive('archMemberSpacePersonalInfos', function(archRatingService) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/member-space/arch-member-space-personal-infos.html',
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
