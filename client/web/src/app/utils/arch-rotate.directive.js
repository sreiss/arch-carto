'use strict'
angular.module('archCarto')
  .directive('archRotate', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        attributes.$observe('archRotate', function(archRotate) {
          archRotate = archRotate || 0;
          if (angular.isDefined(archRotate)) {
            var rotation = 'rotate(' + archRotate + 'deg)';
            element.css({
              '-webkit-transform': rotation
            });
          }
        });
      }
    };
  });
