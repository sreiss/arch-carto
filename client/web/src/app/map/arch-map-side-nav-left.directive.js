'use strict'
angular.module('archCarto')
  .directive('archMapSideNavLeft', [
    '$mdSidenav',
    function($mdSidenav) {
      return {
        restrict: 'E',
        scope: {
          mapStatus: '='
        },
        templateUrl: 'app/map/arch-map-side-nav-left.html',
        controller: function($scope, $element, $attrs)
        {

          $scope.openLeft = function() {
            $mdSidenav('leftSideNav').open();
            console.log('Side nav open');
          };

          $scope.closeLeft = function () {
            $mdSidenav('leftSideNav').close();
            console.log('Side nav close');

          };

          $scope.toggleLeft = function() {
            $mdSidenav('leftSideNav').toggle();
            console.log('Side nav toggle');

          };

        },
        link: function(scope, element, attributes) {
        }
      };
    }
  ]);
