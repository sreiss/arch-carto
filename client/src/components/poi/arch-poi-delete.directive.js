'use strict'
angular.module('archCarto')
  .directive('archPoiDelete', function(archPoiService) {
    return {
      restrict: 'A',
      templateUrl: 'components/poi/arch-poi-delete.html',
      scope: {
        poiId: '@'
      },
      link: function(scope, element, attributes) {
        scope.deletePoi = function() {
          scope.$emit('poiDeleted');
          /*archPoiService.deletePoi(scope.poiId, function(result) {

          });*/
        };
      }
    };
  });
