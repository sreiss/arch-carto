 'use strict'
 angular.module('archCarto')
  .directive('archSideNav', function() {
     return {
       restrict: 'E',
       transclude: true,
       templateUrl: 'app/side-nav/arch-side-nav.html',
       link: function(scope, element, attributes) {
         scope.title = attributes.title;
       }
     };
   });
