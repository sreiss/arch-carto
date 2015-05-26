'use strict';
angular.module('archCarto')
  .directive('archMemberSpace', function($mdSidenav) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/member-space/arch-member-space.html',
      link: function(scope, element, attributes, archMap) {
        archMap.setDisplayOptions({
          mapRight: {
            width: 'extra'
          }
        });
        $mdSidenav('right').open();
      }
    }
  });
