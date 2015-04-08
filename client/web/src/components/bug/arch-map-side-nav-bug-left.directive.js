'use strict'
angular.module('archCarto')
  .directive('archMapSideNavBugLeft', [
    function() {
      return {
        restrict: 'E',
        templateUrl: 'components/bug/arch-map-side-nav-bug-left.html',
        link: function(scope, element, attributes) {
          scope.addActions([
            'report',
            'list'
          ]);
        }
      };
    }
  ]);
