'use strict';
angular.module('archCarto')
  .directive('archNavbarWrapper', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/map/arch-navbar-wrapper.html',
      link: function(scope, element) {
        var el = angular.element(element);
        el.parent().find('.arch-navbar').hide();
      }
    }
  });
