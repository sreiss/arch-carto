'use strict'
angular.module('archCarto')
  .directive('archPathDetailsPopup', function($rootScope, archPathService, httpConstant) {
    return {
      restrict: 'E',
      templateUrl: 'components/path/arch-path-details-popup.html',
      link: function(scope, element, attributes) {
        scope.apiUrl = httpConstant.cartoServerUrl;

        var refresh = function() {
          archPathService.get(scope.id)
            .then(function (result) {
              scope.path = result.value;
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
