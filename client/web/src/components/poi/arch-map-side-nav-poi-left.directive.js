'use strict'
angular.module('archCarto')
  .directive('archMapSideNavPoiLeft', function($mdSidenav) {
      return {
        restrict: 'E',
        require: '^archMap',
        templateUrl: 'components/poi/arch-map-side-nav-poi-left.html',
        link: function(scope, element, attributes, archMap) {
          /*scope.$watch('mapStatus.clicked', function(clicked) {
            if (clicked) {
              $mdSidenav('rightSideNav').toggle();
            }
          });*/
          /*archMap.getMap()
            .then(function(map) {
              debugger;
            });*/
          scope.addActions([
            'addPoi'
          ]);

          /*scope.doAction = function(name) {
            for (var action in scope.actions) {
              scope.actions[action] = false
            }

            if (angular.isDefined(scope.actions[name])) {

              scope.actions[name] = true;
              $mdSidenav('rightSideNav').toggle();
            }
          };*/
        }
      };
    }
  );
