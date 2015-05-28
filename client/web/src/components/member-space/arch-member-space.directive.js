'use strict';
angular.module('archCarto')
  .directive('archMemberSpace', function($mdSidenav, $state) {
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

        scope.cancel = function() {
          $mdSidenav('right').close()
            .then(function() {
              $state.go('map.home');
            });
        }
      }
    }
  });
