'use strict'
angular.module('archCarto')
  .directive('archPathDetailsPopup', function($rootScope, archPathService, httpConstant, archInfoService) {
    return {
      restrict: 'E',
      templateUrl: 'components/path/arch-path-details-popup.html',
      link: function(scope, element, attributes) {
        scope.apiUrl = httpConstant.cartoServerUrl;
        var refresh = function() {
          archPathService.get(scope.id)
            .then(function (result) {
              scope.path = result.value;
              archInfoService.getDistance(result.value)
                .then(function(distance){
                  scope.length = distance;
                });
            });
        };
        refresh();

        $rootScope.$on('pathUpdated', function(event, path) {
          if (path._id == scope.path._id) {
            refresh();
          }
        });
      }
    }
  });
