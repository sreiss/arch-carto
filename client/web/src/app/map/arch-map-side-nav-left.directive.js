'use strict'
angular.module('archCarto')
  .directive('archMapSideNavLeft',function($mdSidenav, $mdToast) {
      return {
        restrict: 'E',
        scope: {
          mapStatus: '='
        },
        templateUrl: 'app/map/arch-map-side-nav-left.html',
        controller: function($scope, $element, $attrs)
        {
          $scope.toastPosition = {
            bottom: false,
            top: true,
            left: false,
            right: true
          };
          $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
              .filter(function(pos) { return $scope.toastPosition[pos]; })
              .join(' ');
          };
          $scope.showSimpleToast = function(content) {
            $mdToast.show(
              $mdToast.simple()
                .content(content) // ajouter dans le translate
                .position($scope.getToastPosition())
                .hideDelay(300)
            );
          };
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
    });

